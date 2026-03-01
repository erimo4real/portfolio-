# 🌱 Database Seeding Guide

Learn how to populate your database with sample data including blog posts with video embeds.

---

## 📋 What Gets Seeded

The seed script creates:
- ✅ 1 Admin user
- ✅ 1 Profile with bio
- ✅ 23 Skills (Frontend, Backend, DevOps, Tooling)
- ✅ 6 Projects (various statuses)
- ✅ 6 Blog posts with video examples
  - 2 with YouTube embeds
  - 1 with TikTok embed example
  - 3 text-only posts
- ✅ 1 Resume entry

---

## 🚀 How to Run

### Option 1: Complete Seed (Recommended)

Seeds everything including sample blog posts with videos:

```bash
cd backend
npm run seed:complete
```

**⚠️ Warning:** This will delete all existing data!

### Option 2: Admin Only

Creates only the admin user:

```bash
cd backend
npm run seed:admin
```

Or with custom credentials:

```bash
cd backend
node src/scripts/seed-admin.js your@email.com yourpassword
```

---

## 📹 Video Examples Included

### Blog Post 1: "Getting Started with React Hooks"
- **Video Type:** YouTube embed
- **Content:** React Hooks tutorial with video + written guide
- **Status:** Published

### Blog Post 2: "Building RESTful APIs with Node.js"
- **Video Type:** YouTube embed
- **Content:** Node.js API tutorial with video + code examples
- **Status:** Published

### Blog Post 3: "5 JavaScript Tips"
- **Video Type:** TikTok embed (example)
- **Content:** Quick tips with TikTok video placeholder
- **Status:** Published
- **Note:** Replace TikTok video ID with your actual video

### Other Posts:
- Docker guide (text only)
- JavaScript Closures (text only)
- MongoDB Optimization (draft)

---

## 🔐 Default Admin Credentials

After seeding, you can login with:

**Email:** admin@example.com  
**Password:** admin123

**⚠️ Important:** Change these credentials after first login!

---

## 📝 Customizing the Seed Data

### Edit Blog Posts with Videos

Open `backend/src/scripts/seed-complete.js` and find the blogs array:

```javascript
const blogs = [
  {
    title: "Your Title",
    slug: slugify("Your Title", { lower: true }),
    markdown: `# Your Title

## 📹 Video Tutorial

<iframe width="100%" height="400" 
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
  frameborder="0" allowfullscreen>
</iframe>

Your content here...
`,
    order: 0,
    published: true
  }
];
```

### Add Your Own Videos

Replace the video IDs:
- **YouTube:** Change `YOUR_VIDEO_ID` in the iframe src
- **TikTok:** Change `data-video-id` and the cite URL
- **Instagram:** Add Instagram embed code
- **Twitter:** Add Twitter embed code

See [docs/guides/](guides/) for embed code examples.

---

## 🎯 Step-by-Step Seeding Process

### 1. Ensure MongoDB is Running

```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 2. Configure Environment

Make sure `backend/.env` has MongoDB connection:

```env
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key
PORT=4000
```

### 3. Run Seed Script

```bash
cd backend
npm run seed:complete
```

### 4. Verify Data

```bash
# Connect to MongoDB
mongosh

# Switch to database
use portfolio

# Check collections
show collections

# Count documents
db.blogs.countDocuments()
db.projects.countDocuments()
db.skills.countDocuments()
```

### 5. Start the Application

```bash
# Backend (if not running)
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm run dev
```

### 6. Login and Verify

1. Go to http://localhost:5173/admin/login
2. Login with admin@example.com / admin123
3. Check Admin → Blogs to see video posts
4. Visit public blog to see videos rendered

---

## 🔄 Re-seeding

To re-seed the database:

```bash
cd backend
npm run seed:complete
```

This will:
1. Delete all existing data
2. Create fresh sample data
3. Include all video examples

---

## 📊 Sample Data Details

### Projects:
- **E-Commerce Platform** (Completed, Featured)
- **Real-Time Chat App** (Completed, Featured)
- **Task Management System** (Completed)
- **Weather Dashboard** (Completed)
- **AI Content Generator** (In Progress)
- **Blockchain Explorer** (Idea)

### Skills by Category:
- **Frontend:** React, TypeScript, Redux, Vue.js, HTML5/CSS3, Tailwind
- **Backend:** Node.js, Express, MongoDB, PostgreSQL, REST APIs, GraphQL, Python
- **DevOps:** Docker, Kubernetes, AWS, CI/CD, Nginx
- **Tooling:** Git, VS Code, Webpack, Jest, Postman

### Blog Posts:
1. React Hooks (with YouTube video)
2. Node.js APIs (with YouTube video)
3. JavaScript Tips (with TikTok example)
4. Docker Guide
5. JavaScript Closures
6. MongoDB Optimization (draft)

---

## 🎨 Customization Tips

### Add More Video Posts

1. Open `backend/src/scripts/seed-complete.js`
2. Add new blog object to the `blogs` array
3. Include video embed code in markdown
4. Run seed script again

### Change Video Platforms

Replace embed codes with your preferred platform:

**YouTube:**
```html
<iframe width="100%" height="400" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" allowfullscreen>
</iframe>
```

**TikTok:**
```html
<blockquote class="tiktok-embed" 
  cite="https://www.tiktok.com/@user/video/VIDEO_ID" 
  data-video-id="VIDEO_ID" 
  style="max-width: 605px; margin: 0 auto;">
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>
```

**Instagram:**
```html
<blockquote class="instagram-media" 
  data-instgrm-permalink="https://www.instagram.com/p/POST_CODE/" 
  data-instgrm-version="14" 
  style="margin: 0 auto;">
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
```

---

## ⚠️ Troubleshooting

### "Connection refused" error
- Make sure MongoDB is running
- Check MONGO_URI in .env file

### "Admin already exists" error
- This is normal if admin was created before
- Use `npm run seed:complete` to reset everything

### Videos not showing
- Check if embed codes are correct
- Verify video IDs are valid
- Test video URLs in browser first

### Seed script hangs
- Check MongoDB connection
- Ensure no other process is using the database
- Try restarting MongoDB

---

## 📚 Related Documentation

- **Video Guides:** [docs/guides/](guides/)
- **Quick Start:** [docs/QUICK_START.md](QUICK_START.md)
- **Troubleshooting:** [docs/QUICK_FIX.md](QUICK_FIX.md)

---

## ✅ Verification Checklist

After seeding, verify:
- [ ] Can login with admin credentials
- [ ] Profile page shows sample data
- [ ] Skills are organized by category
- [ ] Projects display with status badges
- [ ] Blog posts are visible
- [ ] Videos render correctly in blog posts
- [ ] Resume entry exists

---

## 🎉 You're All Set!

Your database is now populated with sample data including blog posts with video embeds. You can:
1. Edit the sample content through admin panel
2. Add your own videos
3. Create new blog posts with videos
4. Customize projects and skills

**Happy coding! 🚀**
