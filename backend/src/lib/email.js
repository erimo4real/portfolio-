import nodemailer from "nodemailer";
import { logger } from "../middleware/error.js";

let transporter = null;

async function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    try {
      await transporter.verify();
      console.log("[email] SMTP verify OK");
      logger.info("SMTP transporter verified successfully");
    } catch (verifyErr) {
      console.log("[email] SMTP verify FAILED:", verifyErr.message, verifyErr.code);
      logger.error({ err: verifyErr }, "SMTP transporter verification failed");
    }
  }
  return transporter;
}

export async function sendPasswordResetEmail(email, resetToken) {
  const domain = email.split("@")[1];
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/admin/reset-password?token=${resetToken}`;
  
  console.log("[email] SMTP_USER:", process.env.SMTP_USER?.substring(0, 3) + "***");
  console.log("[email] SMTP_HOST:", process.env.SMTP_HOST);
  console.log("[email] SMTP_PORT:", process.env.SMTP_PORT);
  console.log("[email] SMTP_FROM:", process.env.SMTP_FROM);
  console.log("[email] FRONTEND_URL:", process.env.FRONTEND_URL);
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || '"Portfolio Admin" <noreply@example.com>',
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your portfolio admin account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
        <p>Or copy and paste this link: ${resetUrl}</p>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    console.log("[email] Calling getTransporter()...");
    const transport = await getTransporter();
    console.log("[email] Transporter obtained, calling sendMail...");
    const info = await transport.sendMail(mailOptions);
    console.log("[email] sendMail result:", info.messageId);
    logger.info("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.log("[email] ERROR:", error.message, error.code);
    logger.error({ err: error, domain }, "Failed to send email");
    return false;
  }
}
