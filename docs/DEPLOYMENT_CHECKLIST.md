# ✅ Deployment Checklist: Secure Authentication

## 🎯 Pre-Deployment Checklist

Use this checklist before deploying to production.

---

## 📋 Backend Configuration

### Environment Variables
- [ ] `JWT_SECRET` is set to a strong random value (not "dev-secret")
  ```bash
  # Generate a strong secret:
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] `FRONTEND_URL` is set to your production frontend URL
- [ ] `NODE_ENV` is set to "production"
- [ ] `PORT` is configured correctly
- [ ] `MONGODB_URI` points to production database

### Dependencies
- [ ] `cookie-parser` is installed
