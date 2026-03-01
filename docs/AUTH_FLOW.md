# 🔐 Authentication Flow Diagrams

## 1. Login Flow

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { identifier, password }
       ▼
┌─────────────────────────────────────┐
│         Backend Server              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Auth Service                │  │
│  │  - Validate credentials      │  │
│  │  - Hash comparison           │  │
│  │  - Generate JWT token        │  │
│  └──────────────────────────────┘  │
│                                     │
│  2. Set httpOnly Cookie             │
│     auth_token=JWT                  │
│     httpOnly=true                   │
│     secure=true (production)        │
│     sameSite=strict                 │
│     maxAge=7 days                   │
└─────────────┬───────────────────────┘
              │
              │ 3. Response
              │    { success: true, admin: {...} }
              ▼
       ┌──────────────┐
       │   Browser    │
       │              │
       │  Cookie:     │
       │  auth_token  │
       │  (httpOnly)  │
       └──────┬───────┘
              │
              │ 4. Redux Update
              │    isAuthenticated = true
              ▼
       ┌──────────────┐
       │   Redirect   │
       │  to /admin   │
       └──────────────┘
```

---

## 2. Protected Route Access

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       │ 1. GET /api/profile
       │    Cookie: auth_token=JWT
       ▼
┌─────────────────────────────────────┐
│         Backend Server              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Auth Middleware             │  │
│  │  - Extract token from cookie│  │
│  │  - Verify JWT signature      │  │
│  │  - Check expiration          │  │
│  │  - Validate admin role       │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ▼                       │
│      Valid Token?                   │
│      ┌───┴───┐                     │
│     YES     NO                      │
│      │       │                      │
│      │       └──► 401 Unauthorized  │
│      │                               │
│      ▼                               │
│  ┌──────────────────────────────┐  │
│  │  Route Handler               │  │
│  │  - Process request           │  │
│  │  - Return data               │  │
│  └──────────────────────────────┘  │
└─────────────┬───────────────────────┘
              │
              │ 2. Response
              │    { data: {...} }
              ▼
       ┌──────────────┐
       │   Browser    │
       │  Display     │
       │   Data       │
       └──────────────┘
```

---

## 3. Logout Flow

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/logout
       │    Cookie: auth_token=JWT
       ▼
┌─────────────────────────────────────┐
│         Backend Server              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Logout Handler              │  │
│  │  - Clear auth_token cookie   │  │
│  └──────────────────────────────┘  │
│                                     │
│  2. Clear Cookie                    │
│     Set-Cookie: auth_token=;        │
│     expires=Thu, 01 Jan 1970        │
└─────────────┬───────────────────────┘
              │
              │ 3. Response
              │    { success: true }
              ▼
       ┌──────────────┐
       │   Browser    │
       │              │
       │  Cookie:     │
       │  (cleared)   │
       └──────┬───────┘
              │
              │ 4. Redux Update
              │    isAuthenticated = false
              ▼
       ┌──────────────┐
       │   Redirect   │
       │  to /login   │
       └──────────────┘
```

---

## 4. Password Reset Flow

### Step 1: Request Reset

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       │ 1. Click "Forgot Password?"
       ▼
┌──────────────────┐
│  Forgot Password │
│      Page        │
└──────┬───────────┘
       │
       │ 2. POST /api/auth/forgot-password
       │    { identifier: "user@email.com" }
       ▼
┌─────────────────────────────────────┐
│         Backend Server              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Password Reset Service      │  │
│  │  - Find user by identifier   │  │
│  │  - Generate reset JWT        │  │
│  │    type: "reset"             │  │
│  │    expires: 1 hour           │  │
│  │  - Log token (dev)           │  │
│  │  - Send email (production)   │  │
│  └──────────────────────────────┘  │
└─────────────┬───────────────────────┘
              │
              │ 3. Response
              │    { message: "Reset link sent" }
              ▼
       ┌──────────────┐
       │   Browser    │
       │  Show        │
       │  Success     │
       └──────────────┘
              │
              │ 4. User receives email
              │    (or checks console in dev)
              ▼
       ┌──────────────────────────┐
       │  Email with reset link:  │
       │  /reset-password?token=  │
       └──────────────────────────┘
```

### Step 2: Reset Password

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │
       │ 1. Click reset link
       │    /admin/reset-password?token=JWT
       ▼
┌──────────────────┐
│  Reset Password  │
│      Page        │
└──────┬───────────┘
       │
       │ 2. Enter new password
       │
       │ 3. POST /api/auth/reset-password
       │    { token: "JWT", password: "new123" }
       ▼
┌─────────────────────────────────────┐
│         Backend Server              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Reset Password Service      │  │
│  │  - Verify JWT token          │  │
│  │  - Check type === "reset"    │  │
│  │  - Check expiration          │  │
│  │  - Hash new password         │  │
│  │  - Update in database        │  │
│  └──────────────────────────────┘  │
└─────────────┬───────────────────────┘
              │
              │ 4. Response
              │    { message: "Password reset successful" }
              ▼
       ┌──────────────┐
       │   Browser    │
       │  Show        │
       │  Success     │
       └──────┬───────┘
              │
              │ 5. Auto-redirect after 3s
              ▼
       ┌──────────────┐
       │  Login Page  │
       │  (use new    │
       │  password)   │
       └──────────────┘
```

---

## 5. Security Layers

```
┌─────────────────────────────────────────────────────┐
│                    User Browser                     │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         httpOnly Cookie                       │ │
│  │  - JavaScript CANNOT access                   │ │
│  │  - Automatically sent with requests           │ │
│  │  - XSS Protection ✓                           │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────┬───────────────────────────────┘
                      │
                      │ HTTPS (in production)
                      │ Encrypted transmission
                      │
┌─────────────────────▼───────────────────────────────┐
│                 Backend Server                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         CORS Configuration                    │ │
│  │  - credentials: true                          │ │
│  │  - origin: FRONTEND_URL only                  │ │
│  │  - CSRF Protection ✓                          │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         Cookie Configuration                  │ │
│  │  - httpOnly: true (XSS protection)            │ │
│  │  - secure: true (HTTPS only in prod)          │ │
│  │  - sameSite: 'strict' (CSRF protection)       │ │
│  │  - maxAge: 7 days                             │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         JWT Token                             │ │
│  │  - Signed with secret key                     │ │
│  │  - Contains: user ID, role, expiration        │ │
│  │  - Verified on every request                  │ │
│  │  - Token Integrity ✓                          │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         Password Security                     │ │
│  │  - bcrypt hashing (10 rounds)                 │ │
│  │  - Never stored in plain text                 │ │
│  │  - Secure Password Storage ✓                  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │         Rate Limiting                         │ │
│  │  - 300 requests per 15 min (API)              │ │
│  │  - 30 requests per hour (contact/analytics)   │ │
│  │  - Brute Force Protection ✓                   │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 6. Token Comparison

### Before: localStorage (Insecure)

```
┌─────────────────────────────────────┐
│         Browser                     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  localStorage                │  │
│  │  token: "eyJhbGc..."         │  │
│  │                              │  │
│  │  ❌ Accessible to JS         │  │
│  │  ❌ Vulnerable to XSS        │  │
│  │  ❌ Manual management        │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Malicious Script            │  │
│  │  localStorage.getItem()      │  │
│  │  → Can steal token! 🚨       │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### After: httpOnly Cookie (Secure)

```
┌─────────────────────────────────────┐
│         Browser                     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  httpOnly Cookie             │  │
│  │  auth_token: "eyJhbGc..."    │  │
│  │                              │  │
│  │  ✅ NOT accessible to JS     │  │
│  │  ✅ XSS protected            │  │
│  │  ✅ Auto-managed             │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Malicious Script            │  │
│  │  document.cookie             │  │
│  │  → Cannot access! ✅         │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 7. Complete Security Stack

```
┌─────────────────────────────────────────────────────┐
│                  Security Layers                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Layer 1: Transport Security                        │
│  ├─ HTTPS encryption (production)                   │
│  └─ Secure cookie flag                              │
│                                                     │
│  Layer 2: Cookie Security                           │
│  ├─ httpOnly (XSS protection)                       │
│  ├─ sameSite=strict (CSRF protection)               │
│  └─ 7-day expiration                                │
│                                                     │
│  Layer 3: Token Security                            │
│  ├─ JWT with signature verification                 │
│  ├─ Role-based access control                       │
│  └─ Expiration validation                           │
│                                                     │
│  Layer 4: Password Security                         │
│  ├─ bcrypt hashing (10 rounds)                      │
│  ├─ Minimum 6 characters                            │
│  └─ Secure reset tokens (1-hour expiry)             │
│                                                     │
│  Layer 5: Network Security                          │
│  ├─ CORS with credentials                           │
│  ├─ Origin whitelist                                │
│  └─ Rate limiting                                   │
│                                                     │
│  Layer 6: Application Security                      │
│  ├─ Input validation (Zod)                          │
│  ├─ Error handling                                  │
│  └─ Audit logging                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Key Takeaways

1. **httpOnly cookies** prevent JavaScript from accessing tokens
2. **JWT tokens** are signed and verified on every request
3. **Password resets** use time-limited tokens
4. **Multiple security layers** protect against various attacks
5. **Automatic cookie management** by the browser
6. **CORS and SameSite** prevent cross-site attacks

Your portfolio is now **production-ready** with enterprise-grade security! 🔐
