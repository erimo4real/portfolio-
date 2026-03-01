# 🔐 Authentication System Documentation

## Overview

This portfolio application now uses a **secure httpOnly cookie-based JWT authentication system** with **password reset functionality**.

---

## 🔒 Security Features

### 1. **httpOnly Cookies (Not localStorage)**
- JWT tokens are stored in **httpOnly cookies** (JavaScript cannot access them)
- Protected against **XSS attacks** (Cross-Site Scripting)
- Automatic cookie management by the browser
- Secure flag enabled in production (HTTPS only)
- SameSite=strict for CSRF protection

### 2. **Password Reset Flow**
- Secure token-based password reset
- Reset tokens expire after 1 hour
- Email/phone validation without revealing user existence
- Tokens are single-use only

---

## 📋 API Endpoints

### Authentication Endpoints

#### **POST /api/auth/login**
Login with email or phone and password.

**Request:**
```json
{
  "identifier": "admin@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "success": true,
  "admin": {
    "id": "...",
    "email": "admin@example.com",
    "phone": null
  }
}
```

**Cookie Set:** `auth_token` (httpOnly, secure in production, 7 days expiry)

---

#### **POST /api/auth/logout**
Logout and clear authentication cookie.

**Response:**
```json
{
  "success": true
}
```

**Cookie Cleared:** `auth_token`

---

#### **POST /api/auth/forgot-password**
Request a password reset link.

**Request:**
```json
{
  "identifier": "admin@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists, a reset link has been sent",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Only in development
}
```

**Note:** In production, the token should be sent via email, not returned in the response.

---

#### **POST /api/auth/reset-password**
Reset password using the reset token.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

---

## 🎨 Frontend Pages

### 1. **Login Page** (`/admin/login`)
- Animated briefcase character
- Eyes follow email input
- Covers eyes when typing password
- "Forgot Password?" link

### 2. **Forgot Password Page** (`/admin/forgot-password`)
- Email/phone input
- Success message after submission
- Link back to login

### 3. **Reset Password Page** (`/admin/reset-password?token=...`)
- New password input with confirmation
- Show/hide password toggle
- Auto-redirect to login after success
- Token validation

---

## 🔧 Configuration

### Backend Environment Variables

Add to `backend/.env`:

```env
# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### Frontend Configuration

The frontend automatically sends cookies with requests using:

```javascript
// frontend/src/lib/api.js
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true // Enable sending cookies
});
```

---

## 🚀 How It Works

### Login Flow

1. User submits email/phone and password
2. Backend validates credentials
3. Backend generates JWT token
4. Backend sets httpOnly cookie with token
5. Frontend receives success response
6. Redux stores authentication state
7. User is redirected to admin dashboard

### Protected Routes

```javascript
// frontend/src/components/ProtectedRoute.jsx
export function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}
```

### Middleware Authentication

```javascript
// backend/src/middleware/auth.js
export function requireAdmin(req, res, next) {
  // Try cookie first, then Authorization header (fallback)
  let token = req.cookies?.auth_token;
  
  if (!token) {
    const header = req.headers.authorization || "";
    token = header.startsWith("Bearer ") ? header.slice(7) : null;
  }
  
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  // Verify JWT and check admin role
  const payload = jwt.verify(token, secret);
  if (payload.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  
  req.adminId = payload.sub;
  next();
}
```

---

## 🔄 Password Reset Flow

### Step 1: Request Reset
1. User clicks "Forgot Password?" on login page
2. User enters email/phone
3. Backend generates reset token (JWT with type="reset", expires in 1h)
4. Backend logs token to console (in production, send via email)
5. User receives success message

### Step 2: Reset Password
1. User clicks reset link with token: `/admin/reset-password?token=...`
2. User enters new password (twice for confirmation)
3. Backend validates token
4. Backend updates password hash in database
5. User is redirected to login page

---

## 📧 Email Integration (TODO)

Currently, reset tokens are logged to the console. To enable email sending:

### Option 1: Nodemailer (SMTP)

```bash
npm install nodemailer
```

```javascript
// backend/src/lib/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link expires in 1 hour.</p>
    `
  });
}
```

### Option 2: SendGrid

```bash
npm install @sendgrid/mail
```

```javascript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;
  
  await sgMail.send({
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: "Password Reset Request",
    html: `...`
  });
}
```

---

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@example.com","password":"admin123"}' \
  -c cookies.txt
```

### Test Protected Route
```bash
curl http://localhost:4000/api/profile \
  -b cookies.txt
```

### Test Logout
```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

### Test Password Reset Request
```bash
curl -X POST http://localhost:4000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin@example.com"}'
```

### Test Password Reset
```bash
curl -X POST http://localhost:4000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_RESET_TOKEN","password":"newpassword123"}'
```

---

## 🔐 Security Best Practices

### ✅ Implemented
- httpOnly cookies (prevents XSS)
- Secure flag in production (HTTPS only)
- SameSite=strict (prevents CSRF)
- Password hashing with bcrypt
- JWT expiration (7 days for auth, 1 hour for reset)
- Token type validation (auth vs reset)
- CORS with credentials

### 🚧 Recommended Additions
- Rate limiting on login/reset endpoints (already implemented)
- Account lockout after failed attempts
- Email verification for new accounts
- Two-factor authentication (2FA)
- Password strength requirements
- Audit logging for security events

---

## 🐛 Troubleshooting

### Issue: "Unauthorized" on protected routes
**Solution:** Check that cookies are being sent with requests. Ensure `withCredentials: true` in axios config.

### Issue: CORS errors
**Solution:** Verify `FRONTEND_URL` in backend `.env` matches your frontend URL. Ensure `credentials: true` in CORS config.

### Issue: Cookie not being set
**Solution:** Check browser console for cookie warnings. Ensure frontend and backend are on same domain or use proper CORS setup.

### Issue: Reset token expired
**Solution:** Reset tokens expire after 1 hour. Request a new reset link.

---

## 📝 Migration from localStorage

If you had existing code using localStorage:

### Before (Insecure)
```javascript
localStorage.setItem("token", token);
const token = localStorage.getItem("token");
```

### After (Secure)
```javascript
// No manual token storage needed!
// Cookies are automatically managed by the browser
```

---

## 🎉 Summary

Your portfolio now has:
- ✅ Secure httpOnly cookie authentication
- ✅ Password reset functionality
- ✅ Beautiful animated UI pages
- ✅ Protected admin routes
- ✅ Logout functionality
- ✅ CSRF and XSS protection

**Next Steps:**
1. Change `JWT_SECRET` in production
2. Set up email service for password resets
3. Enable HTTPS in production
4. Consider adding 2FA for extra security
