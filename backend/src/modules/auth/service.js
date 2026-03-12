// Authentication service module
// Contains business logic for login, password reset, and admin management
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByEmailOrPhone, findAdminByGoogleId, findAdminByEmail, createAdmin, updateAdminGoogleId } from "./repository.js";
import { sendPasswordResetEmail } from "../../lib/email.js";

// Login function - validates credentials and generates JWT token
// Parameters: identifier (email or phone), password
// Returns: JWT token and admin info
export async function login(identifier, password) {
  // Find admin by email or phone
  const admin = await findAdminByEmailOrPhone(identifier);
  if (!admin) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  // Compare provided password with stored hash
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
  // Generate JWT token with admin ID and role
  const secret = process.env.JWT_SECRET || "dev-secret";
  const token = jwt.sign({ sub: admin.id, role: "admin" }, secret, { expiresIn: "7d" });
  // Return token and sanitized admin data
  return { token, admin: { id: admin.id, email: admin.email, phone: admin.phone } };
}

// Request password reset - generates reset token
// Parameters: identifier (email or phone)
// Returns: confirmation message (doesn't reveal if user exists)
export async function requestPasswordReset(identifier) {
  // Find admin by identifier
  const admin = await findAdminByEmailOrPhone(identifier);
  if (!admin) {
    // Don't reveal if user exists - security best practice
    return { message: "If an account exists, a reset link has been sent" };
  }
  
  // Determine reset destination
  // If identifier is email → use that email
  // If identifier is phone → use admin's email if available
  let resetEmail = null;
  const isEmailInput = identifier.includes("@");
  
  if (isEmailInput) {
    resetEmail = identifier;
  } else {
    // Phone number entered - need email on file
    if (!admin.email) {
      // No email on file - can't send reset
      return { message: "If an account exists, a reset link has been sent" };
    }
    resetEmail = admin.email;
  }
  
  // Generate temporary reset token (expires in 1 hour)
  const secret = process.env.JWT_SECRET || "dev-secret";
  const resetToken = jwt.sign({ sub: admin.id, type: "reset" }, secret, { expiresIn: "1h" });
  
  // Send email with reset link
  const emailSent = await sendPasswordResetEmail(resetEmail, resetToken);
  
  // In development, return token if email fails
  if (!emailSent && process.env.NODE_ENV !== "production") {
    return { message: "If an account exists, a reset link has been sent", resetToken };
  }
  
  return { message: "If an account exists, a reset link has been sent" };
}

// Reset password - validates token and updates password
// Parameters: resetToken (JWT), newPassword
// Returns: success message
export async function resetPassword(resetToken, newPassword) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  
  try {
    // Verify reset token
    const payload = jwt.verify(resetToken, secret);
    if (payload.type !== "reset") {
      throw new Error("Invalid token type");
    }
    
    // Hash new password and update in database
    const hash = await bcrypt.hash(newPassword, 10);
    const { updateAdminPassword } = await import("./repository.js");
    await updateAdminPassword(payload.sub, hash);
    
    return { message: "Password reset successful" };
  } catch (err) {
    // Invalid or expired token
    throw Object.assign(new Error("Invalid or expired reset token"), { status: 400 });
  }
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
  
  const secret = process.env.JWT_SECRET || "dev-secret";
  const token = jwt.sign({ sub: admin.id, role: "admin" }, secret, { expiresIn: "7d" });
  
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
