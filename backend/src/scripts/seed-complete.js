import dotenv from "dotenv";
import { connectDb } from "../config/db.js";
import { Admin } from "../modules/auth/model.js";
import { Profile } from "../modules/profile/model.js";
import { Skill } from "../modules/skills/model.js";
import { Project } from "../modules/projects/model.js";
import { Blog } from "../modules/blog/model.js";
import { Resume } from "../modules/resume/model.js";
import bcrypt from "bcryptjs";
import slugify from "slugify";

dotenv.config();

async function seedComplete() {
  try {
    await connectDb();
    console.log("Connected to database");

    // Clear existing data
    console.log("Clearing existing data...");
    await Admin.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await Resume.deleteMany({});

    // 1. Create Admin User
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      email: "admin@example.com",
      phone: "+1234567890",
      passwordHash: hashedPassword,
      role: "admin"
    });

    // 2. Create Profile
    console.log("Creating profile...");
    await Profile.create({
      headline: "Full Stack Developer & Software Engineer",
      bioMarkdown: `# About Me

I'm a passionate full-stack developer with 5+ years of experience building scalable web applications. 

I specialize in:
- Modern JavaScript frameworks (React, Node.js)
- Cloud architecture and DevOps
- Database design and optimization
- API development and microservices

When I'm not coding, you'll find me contributing to open source projects, writing technical blog posts, or exploring new technologies.

Let's build something amazing together!`,
      status: "published",
      imagePath: null
    });

    // 3. Create Skills
    console.log("Creating skills...");
    const skills = [
      // Frontend
      { name: "React", category: "Frontend", order: 0, published: true },
      { name: "TypeScript", category: "Frontend", order: 1, published: true },
      { name: "Redux", category: "Frontend", order: 2, published: true },
      { name: "Vue.js", category: "Frontend", order: 3, published: true },
      { name: "HTML5/CSS3", category: "Frontend", order: 4, published: true },
      { name: "Tailwind CSS", category: "Frontend", order: 5, published: true },
      
      // Backend
      { name: "Node.js", category: "Backend", order: 0, published: true },
      { name: "Express.js", category: "Backend", order: 1, published: true },
      { name: "MongoDB", category: "Backend", order: 2, published: true },
      { name: "PostgreSQL", category: "Backend", order: 3, published: true },
      { name: "REST APIs", category: "Backend", order: 4, published: true },
      { name: "GraphQL", category: "Backend", order: 5, published: true },
      { name: "Python", category: "Backend", order: 6, published: true },
      
      // DevOps
      { name: "Docker", category: "DevOps", order: 0, published: true },
      { name: "Kubernetes", category: "DevOps", order: 1, published: true },
      { name: "AWS", category: "DevOps", order: 2, published: true },
      { name: "CI/CD", category: "DevOps", order: 3, published: true },
      { name: "Nginx", category: "DevOps", order: 4, published: true },
      
      // Tooling
      { name: "Git", category: "Tooling", order: 0, published: true },
      { name: "VS Code", category: "Tooling", order: 1, published: true },
      { name: "Webpack", category: "Tooling", order: 2, published: true },
      { name: "Jest", category: "Tooling", order: 3, published: true },
      { name: "Postman", category: "Tooling", order: 4, published: true }
    ];
    await Skill.insertMany(skills);

    // 4. Create Projects
    console.log("Creating projects...");
    const projects = [
      {
        title: "E-Commerce Platform",
        slug: slugify("E-Commerce Platform", { lower: true }),
        descriptionMarkdown: `# E-Commerce Platform

A full-featured e-commerce platform built with the MERN stack.

## Features
- User authentication and authorization
- Product catalog with search and filters
- Shopping cart and checkout process
- Payment integration with Stripe
- Admin dashboard for inventory management
- Order tracking and history
- Real-time notifications

## Tech Stack
- React with Redux for state management
- Node.js/Express backend
- MongoDB database
- Stripe payment processing
- AWS S3 for image storage
- Docker containerization`,
        techStack: ["React", "Node.js", "MongoDB", "Express", "Redux", "Stripe", "AWS S3", "Docker"],
        status: "completed",
        order: 0,
        githubUrl: "https://github.com/yourusername/ecommerce-platform",
        demoUrl: "https://demo-ecommerce.example.com",
        featured: true,
        published: true
      },
      {
        title: "Real-Time Chat Application",
        slug: slugify("Real-Time Chat Application", { lower: true }),
        descriptionMarkdown: `# Real-Time Chat Application

A modern chat application with real-time messaging capabilities.

## Features
- Real-time messaging using WebSockets
- Private and group chats
- File sharing and media uploads
- Message reactions and threading
- User presence indicators
- Message search and history
- Push notifications

## Tech Stack
- React frontend with TypeScript
- Socket.io for real-time communication
- Node.js/Express backend
- PostgreSQL database
- Redis for caching
- JWT authentication`,
        techStack: ["React", "TypeScript", "Socket.io", "Node.js", "PostgreSQL", "Redis"],
        status: "completed",
        order: 1,
        githubUrl: "https://github.com/yourusername/chat-app",
        demoUrl: "https://chat-demo.example.com",
        featured: true,
        published: true
      },
      {
        title: "Task Management System",
        slug: slugify("Task Management System", { lower: true }),
        descriptionMarkdown: `# Task Management System

A collaborative task management tool inspired by Trello and Asana.

## Features
- Kanban board interface
- Drag-and-drop task organization
- Team collaboration features
- Task assignments and due dates
- Comments and attachments
- Activity timeline
- Email notifications
- Custom workflows

## Tech Stack
- Vue.js 3 with Composition API
- Node.js/Express backend
- MongoDB with Mongoose
- Drag-and-drop with Vue Draggable
- Tailwind CSS for styling`,
        techStack: ["Vue.js", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
        status: "completed",
        order: 2,
        githubUrl: "https://github.com/yourusername/task-manager",
        demoUrl: null,
        featured: false,
        published: true
      },
      {
        title: "Weather Dashboard",
        slug: slugify("Weather Dashboard", { lower: true }),
        descriptionMarkdown: `# Weather Dashboard

A beautiful weather application with forecasts and historical data.

## Features
- Current weather conditions
- 7-day forecast
- Hourly predictions
- Weather maps and radar
- Location search and favorites
- Weather alerts
- Historical data visualization

## Tech Stack
- React with Hooks
- OpenWeather API
- Chart.js for data visualization
- Geolocation API
- Responsive design`,
        techStack: ["React", "Chart.js", "OpenWeather API", "HTML5", "CSS3"],
        status: "completed",
        order: 3,
        githubUrl: "https://github.com/yourusername/weather-dashboard",
        demoUrl: "https://weather-demo.example.com",
        featured: false,
        published: true
      },
      {
        title: "AI Content Generator",
        slug: slugify("AI Content Generator", { lower: true }),
        descriptionMarkdown: `# AI Content Generator

An AI-powered tool for generating marketing content and blog posts.

## Features
- Multiple content types (blogs, social media, emails)
- Tone and style customization
- SEO optimization suggestions
- Content templates
- Export to various formats
- Usage analytics

## Tech Stack
- React frontend
- Python/FastAPI backend
- OpenAI GPT integration
- PostgreSQL database
- Redis for rate limiting
- Docker deployment

## Status
Currently in active development. Beta version coming soon!`,
        techStack: ["React", "Python", "FastAPI", "OpenAI", "PostgreSQL", "Docker"],
        status: "in_progress",
        order: 4,
        githubUrl: "https://github.com/yourusername/ai-content-gen",
        demoUrl: null,
        featured: false,
        published: true
      },
      {
        title: "Blockchain Explorer",
        slug: slugify("Blockchain Explorer", { lower: true }),
        descriptionMarkdown: `# Blockchain Explorer

A blockchain explorer for viewing transactions and smart contracts.

## Planned Features
- Transaction search and details
- Block explorer
- Smart contract verification
- Wallet tracking
- Network statistics
- API for developers

## Tech Stack (Planned)
- React/Next.js
- Web3.js
- Node.js backend
- MongoDB
- GraphQL API`,
        techStack: ["React", "Next.js", "Web3.js", "GraphQL", "MongoDB"],
        status: "idea",
        order: 5,
        githubUrl: null,
        demoUrl: null,
        featured: false,
        published: true
      }
    ];
    await Project.insertMany(projects);

    // 5. Create Blog Posts
    console.log("Creating blog posts...");
    const blogs = [
      {
        title: "Getting Started with React Hooks",
        slug: slugify("Getting Started with React Hooks", { lower: true }),
        markdown: `# Getting Started with React Hooks

React Hooks revolutionized how we write React components. In this post, we'll explore the most commonly used hooks and when to use them.

## 📹 Video Tutorial

<iframe width="100%" height="400" src="https://www.youtube.com/embed/O6P86uwfdR0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

*Prefer reading? Continue below for the written guide!*

---

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8.

## useState Hook

The most basic hook for managing state:

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

For side effects like data fetching:

\`\`\`javascript
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // Re-run when userId changes
  
  return <div>{user?.name}</div>;
}
\`\`\`

## Best Practices

1. **Always use hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Use the dependency array correctly** - Include all values from component scope that change over time
3. **Custom hooks for reusability** - Extract common logic into custom hooks

## Conclusion

Hooks make React code more readable and maintainable. Start with useState and useEffect, then explore other hooks as needed.

Happy coding!`,
        order: 0,
        published: true
      },
      {
        title: "Building RESTful APIs with Node.js and Express",
        slug: slugify("Building RESTful APIs with Node.js and Express", { lower: true }),
        markdown: `# Building RESTful APIs with Node.js and Express

Learn how to build robust and scalable REST APIs using Node.js and Express.

## 📹 Watch the Full Tutorial

<iframe width="100%" height="400" src="https://www.youtube.com/embed/fgTGADljAeg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## Why Express?

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Setting Up

First, initialize your project:

\`\`\`bash
npm init -y
npm install express mongoose dotenv
\`\`\`

## Basic Server Setup

\`\`\`javascript
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Creating Routes

\`\`\`javascript
// GET all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
\`\`\`

## Best Practices

1. **Use proper HTTP status codes** - 200 for success, 201 for created, 400 for bad request, etc.
2. **Implement error handling middleware** - Centralize error handling
3. **Validate input data** - Use libraries like Zod or Joi
4. **Use environment variables** - Never hardcode sensitive data
5. **Implement rate limiting** - Protect your API from abuse
6. **Add authentication** - Use JWT or OAuth

## Conclusion

Express makes it easy to build powerful APIs. Follow REST conventions and best practices for maintainable code.`,
        order: 1,
        published: true
      },
      {
        title: "Docker for Developers: A Practical Guide",
        slug: slugify("Docker for Developers: A Practical Guide", { lower: true }),
        markdown: `# Docker for Developers: A Practical Guide

Docker has become an essential tool for modern development. Let's explore how to use it effectively.

## What is Docker?

Docker is a platform for developing, shipping, and running applications in containers. Containers package your application with all its dependencies.

## Why Use Docker?

- **Consistency** - Same environment across development, testing, and production
- **Isolation** - Each container runs independently
- **Portability** - Run anywhere Docker is installed
- **Efficiency** - Lightweight compared to virtual machines

## Basic Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

## Docker Compose

For multi-container applications:

\`\`\`yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/mydb
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
\`\`\`

## Common Commands

\`\`\`bash
# Build image
docker build -t myapp .

# Run container
docker run -p 3000:3000 myapp

# View running containers
docker ps

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>
\`\`\`

## Best Practices

1. **Use official base images** - More secure and maintained
2. **Minimize layers** - Combine RUN commands when possible
3. **Use .dockerignore** - Exclude unnecessary files
4. **Don't run as root** - Create a non-root user
5. **Use multi-stage builds** - Reduce final image size

## Conclusion

Docker simplifies deployment and ensures consistency. Start containerizing your applications today!`,
        order: 2,
        published: true
      },
      {
        title: "5 JavaScript Tips Every Developer Should Know",
        slug: slugify("5 JavaScript Tips Every Developer Should Know", { lower: true }),
        markdown: `# 5 JavaScript Tips Every Developer Should Know

Quick tips to level up your JavaScript skills!

## 🎵 Quick TikTok Version (60 seconds)

<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@developer/video/7123456789" data-video-id="7123456789" style="max-width: 605px; min-width: 325px; margin: 0 auto;">
  <section>
    <a target="_blank" href="https://www.tiktok.com/@developer">@developer</a>
  </section>
</blockquote>
<script async src="https://www.tiktok.com/embed.js"></script>

*Note: Replace with your actual TikTok video ID*

---

## Tip 1: Use Destructuring

Destructuring makes your code cleaner and more readable:

\`\`\`javascript
// Before
const firstName = user.firstName;
const lastName = user.lastName;

// After
const { firstName, lastName } = user;
\`\`\`

## Tip 2: Template Literals

Use template literals for string interpolation:

\`\`\`javascript
// Before
const greeting = "Hello, " + name + "!";

// After
const greeting = \`Hello, \${name}!\`;
\`\`\`

## Tip 3: Arrow Functions

Arrow functions provide shorter syntax:

\`\`\`javascript
// Before
function add(a, b) {
  return a + b;
}

// After
const add = (a, b) => a + b;
\`\`\`

## Tip 4: Spread Operator

The spread operator is incredibly useful:

\`\`\`javascript
// Combine arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

// Clone objects
const user = { name: "John", age: 25 };
const userCopy = { ...user };
\`\`\`

## Tip 5: Optional Chaining

Safely access nested properties:

\`\`\`javascript
// Before
const city = user && user.address && user.address.city;

// After
const city = user?.address?.city;
\`\`\`

## Conclusion

These tips will make your JavaScript code more modern and maintainable. Start using them today!

## 🔗 More Resources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)`,
        order: 5,
        published: true
      },
      {
        title: "Understanding JavaScript Closures",
        slug: slugify("Understanding JavaScript Closures", { lower: true }),
        markdown: `# Understanding JavaScript Closures

Closures are one of the most powerful features in JavaScript. Let's demystify them.

## What is a Closure?

A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

## Simple Example

\`\`\`javascript
function outer() {
  const message = "Hello";
  
  function inner() {
    console.log(message); // Can access 'message'
  }
  
  return inner;
}

const myFunc = outer();
myFunc(); // Logs: "Hello"
\`\`\`

## Practical Use Cases

### 1. Data Privacy

\`\`\`javascript
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
\`\`\`

### 2. Function Factories

\`\`\`javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

### 3. Event Handlers

\`\`\`javascript
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId);
  
  button.addEventListener('click', function() {
    alert(message); // Closure over 'message'
  });
}

setupButton('btn1', 'Button 1 clicked!');
setupButton('btn2', 'Button 2 clicked!');
\`\`\`

## Common Pitfalls

### Loop Problem

\`\`\`javascript
// Wrong
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Logs: 3, 3, 3
  }, 1000);
}

// Correct with let
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Logs: 0, 1, 2
  }, 1000);
}

// Correct with closure
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // Logs: 0, 1, 2
    }, 1000);
  })(i);
}
\`\`\`

## Conclusion

Closures enable powerful patterns like data privacy, function factories, and callbacks. Master them to write better JavaScript!`,
        order: 3,
        published: true
      },
      {
        title: "MongoDB Performance Optimization Tips",
        slug: slugify("MongoDB Performance Optimization Tips", { lower: true }),
        markdown: `# MongoDB Performance Optimization Tips

Learn how to optimize your MongoDB queries and improve database performance.

## 1. Use Indexes Wisely

Indexes are crucial for query performance:

\`\`\`javascript
// Create single field index
db.users.createIndex({ email: 1 });

// Create compound index
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Create text index for search
db.posts.createIndex({ title: "text", content: "text" });
\`\`\`

## 2. Analyze Query Performance

Use explain() to understand query execution:

\`\`\`javascript
db.users.find({ email: "test@example.com" }).explain("executionStats");
\`\`\`

Look for:
- **executionTimeMillis** - How long the query took
- **totalDocsExamined** - Documents scanned
- **totalKeysExamined** - Index entries scanned

## 3. Projection

Only fetch fields you need:

\`\`\`javascript
// Bad - fetches all fields
db.users.find({ active: true });

// Good - only fetches needed fields
db.users.find({ active: true }, { name: 1, email: 1 });
\`\`\`

## 4. Limit Results

Always limit results when possible:

\`\`\`javascript
db.posts.find().sort({ createdAt: -1 }).limit(10);
\`\`\`

## 5. Avoid Large Documents

Keep documents under 16MB. Split large data:

\`\`\`javascript
// Instead of embedding large arrays
{
  userId: 1,
  posts: [/* thousands of posts */]
}

// Use references
{
  userId: 1,
  postCount: 5000
}

// Separate collection
{ postId: 1, userId: 1, content: "..." }
\`\`\`

## 6. Use Aggregation Pipeline Efficiently

Order stages for performance:

\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "completed" } }, // Filter early
  { $sort: { total: -1 } },
  { $limit: 10 },
  { $lookup: { /* join */ } } // Join after filtering
]);
\`\`\`

## 7. Connection Pooling

Configure appropriate pool size:

\`\`\`javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
\`\`\`

## 8. Monitor Performance

Use MongoDB Atlas or monitoring tools:
- Track slow queries
- Monitor index usage
- Check connection pool metrics
- Review operation statistics

## Conclusion

Performance optimization is an ongoing process. Profile your queries, add appropriate indexes, and monitor your database regularly.`,
        order: 4,
        published: false // Draft
      }
    ];
    await Blog.insertMany(blogs);

    // 6. Create Resume
    console.log("Creating resume...");
    await Resume.create({
      version: "2024-v1",
      path: "/uploads/resume-sample.pdf",
      active: true
    });

    console.log("\n✅ Database seeded successfully!");
    console.log("\nCreated:");
    console.log("- 1 Admin user (admin@example.com / admin123)");
    console.log("- 1 Profile");
    console.log("- 23 Skills (across 4 categories)");
    console.log("- 6 Projects (2 featured, 1 in progress, 1 idea)");
    console.log("- 6 Blog posts (5 published with video examples, 1 draft)");
    console.log("  * 2 with YouTube embeds");
    console.log("  * 1 with TikTok embed example");
    console.log("- 1 Resume");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedComplete();
