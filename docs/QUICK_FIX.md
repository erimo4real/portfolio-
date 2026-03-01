# Quick Fix for 500 Error

The 500 error is likely because:
1. MongoDB is not running
2. The database is empty
3. Backend environment variables are not set

## Fix Steps:

### 1. Check if MongoDB is Running

**Windows:**
```bash
# Check if MongoDB service is running
sc query MongoDB

# If not running, start it:
net start MongoDB
```

**Mac/Linux:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /path/to/data
```

### 2. Set Up Backend Environment

Create `backend/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/portfolio
DB_NAME=portfolio
JWT_SECRET=your-super-secret-key-change-this
PORT=4000
NODE_ENV=development
```

### 3. Create Admin User

```bash
cd backend
npm run seed:admin
```

This creates:
- Email: `admin@example.com`
- Password: `admin123`

### 4. Restart Backend

Stop the backend (Ctrl+C) and start again:
```bash
cd backend
npm start
```

### 5. Check Backend is Working

Open: http://localhost:4000/api/health

Should see: `{"ok":true,"uptime":...}`

### 6. Refresh Frontend

Hard refresh: `Ctrl + Shift + R`

---

## Still Getting Errors?

### Check Backend Console

Look for error messages in the terminal where backend is running.

### Common Issues:

**"MongoServerError: connect ECONNREFUSED"**
- MongoDB is not running
- Start MongoDB service

**"ValidationError"**
- Data format issue
- Check the admin panel forms

**"JWT malformed"**
- Clear localStorage in browser console:
  ```javascript
  localStorage.clear()
  ```

### Test Each Endpoint:

```bash
# Test profile (should return {} if empty)
curl http://localhost:4000/api/profile

# Test skills (should return {Frontend:[],Backend:[],DevOps:[],Tooling:[]})
curl http://localhost:4000/api/skills

# Test projects (should return [])
curl http://localhost:4000/api/projects

# Test health
curl http://localhost:4000/api/health
```

If any of these fail, check the backend console for the specific error.
