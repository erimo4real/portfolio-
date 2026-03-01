# How to Start Your Portfolio App

## Prerequisites
Make sure you have Node.js and MongoDB installed.

## Step 1: Start the Backend
Open a terminal and run:
```bash
cd backend
npm install
npm start
```

The backend will start on http://localhost:4000

## Step 2: Start the Frontend
Open another terminal and run:
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

## Step 3: View Your Portfolio
Open your browser and go to: **http://localhost:5173**

## First Time Setup

### Create Admin User
In the backend terminal, run:
```bash
npm run seed:admin
```

Default credentials:
- Email: admin@example.com
- Password: admin123

### Add Some Data
1. Go to http://localhost:5173/admin/login
2. Login with the admin credentials
3. Add your profile, skills, and projects!

## Troubleshooting

If you don't see the new design:
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+Shift+R)
3. Make sure both backend and frontend are running
4. Check the browser console for errors (F12)

## Environment Variables

Create a `.env` file in the backend folder:
```
MONGO_URI=mongodb://localhost:27017/portfolio
DB_NAME=portfolio
JWT_SECRET=your-secret-key-here
PORT=4000
```
