import nodemailer from "nodemailer";
import pkg from "pino";
const logger = pkg();

const errorEmailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendErrorEmail(err, req) {
  const to = process.env.ERROR_EMAIL_TO;
  const from = process.env.ERROR_EMAIL_FROM || process.env.SMTP_USER;
  
  if (!to || !process.env.SMTP_USER) return;
  
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  };
  
  const mailOptions = {
    from: `"Portfolio Error" <${from}>`,
    to,
    subject: `URGENT: Portfolio Error - ${err.message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fee; border: 2px solid red;">
        <h2 style="color: red;">🚨 Portfolio Error Alert</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold;">Error:</td><td style="padding: 8px;">${err.message}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">URL:</td><td style="padding: 8px;">${req.url}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Method:</td><td style="padding: 8px;">${req.method}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${errorDetails.timestamp}</td></tr>
        </table>
        <h3 style="margin-top: 20px;">Stack Trace:</h3>
        <pre style="background: #333; color: #0f0; padding: 15px; overflow-x: auto; border-radius: 5px;">${err.stack}</pre>
        <h3 style="margin-top: 20px;">Request Body:</h3>
        <pre style="background: #333; color: #fff; padding: 15px; overflow-x: auto; border-radius: 5px;">${JSON.stringify(req.body || {}, null, 2)}</pre>
      </div>
    `
  };
  
  try {
    await errorEmailTransporter.sendMail(mailOptions);
  } catch (emailErr) {
    logger.error({ err: emailErr }, "Failed to send error email");
  }
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  logger.error({ err, url: req.url, method: req.method }, "Request error");
  
  if (process.env.NODE_ENV === "production" && status >= 500) {
    sendErrorEmail(err, req).catch(() => {});
  }
  
  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
}

export { logger };