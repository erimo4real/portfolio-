// Authentication routes module
// Handles login, logout, password reset, and session verification
import express from "express";
import jwt from "jsonwebtoken";
import { login, bootstrapAdmin, requestPasswordReset, resetPassword, googleLogin } from "./service.js";
import { getAdminById } from "./repository.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/auth/google/callback";

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await googleLogin(profile);
      return done(null, result);
    } catch (err) {
      return done(err);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Export authentication router
export const authRouter = express.Router();

// Validation schema for login request body
// identifier: email or phone (min 3 chars)
// password: minimum 6 chars
const loginBody = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
  rememberMe: z.boolean().optional()
});

// POST /login - Authenticate admin user
// Validates credentials and sets auth cookie for 7 days
authRouter.post("/login", validate(loginBody), async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const result = await login(identifier, password);
    
    // Set httpOnly cookie - lasts 7 days
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("auth_token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: maxAge,
      domain: isProduction ? undefined : undefined
    });
    
    res.json({ success: true, admin: result.admin });
  } catch (err) {
    next(err);
  }
});

// Validation schema for register request body
const registerBody = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(1).optional()
});

// POST /register - Create new admin account
authRouter.post("/register", validate(registerBody), async (req, res, next) => {
  try {
    const { identifier, password, name } = req.body;
    const { registerAdmin } = await import("./service.js");
    const admin = await registerAdmin(identifier, password, name);
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
});

// Validation schema for forgot password request
const forgotPasswordBody = z.object({
  identifier: z.string().min(3)
});

// POST /forgot-password - Send password reset email
// Takes identifier and sends reset link to user
authRouter.post("/forgot-password", validate(forgotPasswordBody), async (req, res, next) => {
  try {
    const { identifier } = req.body;
    const result = await requestPasswordReset(identifier);
    res.json(result); // Return reset request result
  } catch (err) {
    next(err); // Pass error to error handler
  }
});

// Validation schema for reset password request
// token: reset token from email
// password: new password (min 6 chars)
const resetPasswordBody = z.object({
  token: z.string(),
  password: z.string().min(6)
});

// POST /reset-password - Update user password
// Verifies reset token and updates password
authRouter.post("/reset-password", validate(resetPasswordBody), async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await resetPassword(token, password);
    res.json(result); // Return reset result
  } catch (err) {
    next(err); // Pass error to handler
  }
});

// GET /me - Verify current session
// Checks auth token and returns admin info if valid
authRouter.get("/me", async (req, res, next) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      // No token found - not authenticated
      return res.json({ isAuthenticated: false });
    }
    
    // Verify JWT token
    const secret = process.env.JWT_SECRET || "dev-secret-change-in-production";
    const decoded = jwt.verify(token, secret);
    
    // Get admin from database using token subject (sub)
    const admin = await getAdminById(decoded.sub);
    
    if (!admin) {
      // Admin not found in database - not authenticated
      return res.json({ isAuthenticated: false });
    }
    
    // Return authenticated admin info
    res.json({ 
      isAuthenticated: true, 
      admin: { id: admin.id, name: admin.name, email: admin.email } 
    });
  } catch (err) {
    // Token invalid - not authenticated
    res.json({ isAuthenticated: false });
  }
});

// POST /logout - Clear auth cookie
authRouter.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ success: true });
});

// GET /google - Get Google OAuth URL
authRouter.get("/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ error: "Google OAuth not configured" });
  }
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(GOOGLE_CALLBACK_URL)}` +
    `&response_type=code` +
    `&scope=openid profile email` +
    `&access_type=offline`;
  
  res.json({ url: googleAuthUrl });
});

// GET /google/callback - Handle Google OAuth callback
authRouter.get("/google/callback", 
  passport.authenticate("google", { session: false, failureRedirect: "/admin/login?error=google_auth_failed" }),
  async (req, res) => {
    try {
      const result = req.user;
      const isProduction = process.env.NODE_ENV === "production";
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      
      res.cookie("auth_token", result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: maxAge
      });
      
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/admin`);
    } catch (err) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/admin/login?error=google_auth_failed`);
    }
  }
);
