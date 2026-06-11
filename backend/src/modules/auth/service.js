// Authentication service module
// Contains business logic for login, password reset, and admin management
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { findAdminByEmailOrPhone, findAdminByGoogleId, findAdminByEmail, createAdmin, updateAdminGoogleId, findAdminByResetTokenHash, updateAdminResetToken, clearAdminResetToken, updateAdminPassword } from "./repository.js";
import { sendPasswordResetEmail } from "../../lib/email.js";

// Login function - validates credentials and generates JWT token
// Parameters: identifier (email or phone), password, rememberMe (boolean)
// rememberMe=true: 7-day token, rememberMe=false: 1-hour token
// Returns: JWT token and admin info
export async function login(identifier, password, rememberMe) {
  // Find admin by email or phone
  const admin = await findAdminByEmailOrPhone(identifier);
  if (!admin) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  // Compare provided password with stored hash
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  const expiresIn = rememberMe ? "7d" : "1h";
  const token = jwt.sign({ sub: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn });
  // Return token and sanitized admin data
  return { token, admin: { id: admin.id, email: admin.email, phone: admin.phone } };
}

export async function requestPasswordReset(identifier) {
  const admin = await findAdminByEmailOrPhone(identifier);
  if (!admin) {
    return { message: "If an account exists, a reset link has been sent" };
  }
  
  let resetEmail = null;
  const isEmailInput = identifier.includes("@");
  
  if (isEmailInput) {
    resetEmail = identifier;
  } else {
    if (!admin.email) {
      return { message: "If an account exists, a reset link has been sent" };
    }
    resetEmail = admin.email;
  }
  
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);
  
  await updateAdminResetToken(admin.id, tokenHash, expiry);
  const emailSent = await sendPasswordResetEmail(resetEmail, rawToken);
  if (!emailSent) {
    const { logger } = await import("../../middleware/error.js");
    logger.warn({ resetEmail }, "Password reset email failed to send");
  }
  
  return { message: "If an account exists, a reset link has been sent" };
}

export async function resetPassword(rawToken, newPassword) {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const admin = await findAdminByResetTokenHash(tokenHash);
  
  if (!admin) {
    throw Object.assign(new Error("Invalid or expired reset token"), { status: 400 });
  }
  
  const hash = await bcrypt.hash(newPassword, 10);
  await clearAdminResetToken(admin.id);
  await updateAdminPassword(admin.id, hash);
  
  return { message: "Password reset successful" };
}

// Bootstrap admin - creates initial admin account if none exists
// Parameters: identifier (email or phone), password
// Returns: created or existing admin
export async function bootstrapAdmin(identifier, password) {
  // Check if admin already exists
  const existing = await findAdminByEmailOrPhone(identifier);
  if (existing) return existing;
  // Hash password for storage
  const hash = await bcrypt.hash(password, 10);
  let email = undefined;
  let phone = undefined;
  // Determine if identifier is email or phone
  if (identifier.includes("@")) email = identifier;
  else phone = identifier;
  // Create new admin account
  return createAdmin({ email, phone, passwordHash: hash });
}

// Register new admin - allows email or phone
export async function registerAdmin(identifier, password, name) {
  // Check if admin already exists
  const existing = await findAdminByEmailOrPhone(identifier);
  if (existing) {
    throw Object.assign(new Error("An account with this email or phone already exists"), { status: 400 });
  }
  
  // Hash password
  const hash = await bcrypt.hash(password, 10);
  
  // Determine if identifier is email or phone
  let email = undefined;
  let phone = undefined;
  if (identifier.includes("@")) {
    email = identifier;
  } else {
    phone = identifier;
  }
  
  // Create new admin account
  const admin = await createAdmin({ email, phone, name, passwordHash: hash });
  return { id: admin.id, email: admin.email, phone: admin.phone, name: admin.name };
}

export async function googleLogin(profile) {
  const { googleId, emails, photos, displayName } = profile;
  const email = emails?.[0]?.value;
  const avatar = photos?.[0]?.value;
  
  let admin = await findAdminByGoogleId(googleId);
  
  if (admin) {
    if (avatar && admin.avatar !== avatar) {
      admin.avatar = avatar;
      await admin.save();
    }
  } else if (email) {
    const existingByEmail = await findAdminByEmail(email);
    if (existingByEmail) {
      admin = await updateAdminGoogleId(existingByEmail.id, googleId, avatar);
    } else {
      admin = await createAdmin({ 
        email, 
        googleId, 
        name: displayName, 
        avatar,
        passwordHash: null
      });
    }
  } else {
    throw Object.assign(new Error("Google account must have an email"), { status: 400 });
  }
  
  if (!admin) {
    throw Object.assign(new Error("Failed to process Google login"), { status: 500 });
  }
  
  const token = jwt.sign({ sub: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
  return { 
    token, 
    admin: { 
      id: admin.id, 
      email: admin.email, 
      name: admin.name,
      avatar: admin.avatar 
    } 
  };
}
