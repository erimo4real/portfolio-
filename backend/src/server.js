import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { connectDb } from "./config/db.js";
import { authRouter } from "./modules/auth/routes.js";
import { profileRouter } from "./modules/profile/routes.js";
import { skillsRouter } from "./modules/skills/routes.js";
import { projectsRouter } from "./modules/projects/routes.js";
import { blogRouter } from "./modules/blog/routes.js";
import { resumeRouter } from "./modules/resume/routes.js";
import { contactRouter } from "./modules/contact/routes.js";
import { analyticsRouter } from "./modules/analytics/routes.js";
import { errorHandler, logger } from "./middleware/error.js";

dotenv.config();

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled rejection");
  process.exit(1);
});

if (!process.env.JWT_SECRET) {
  logger.fatal("JWT_SECRET is not set in environment variables!");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL?.replace(/\/$/, ''),
      "http://localhost:5173",
      "http://localhost:5174"
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan("dev"));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api/", apiLimiter);

const uploadDir = path.join(__dirname, "..", "storage", "uploads");
try {
  fs.mkdirSync(uploadDir, { recursive: true });
} catch {}
app.use("/uploads", express.static(uploadDir));

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/contact", contactRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use(errorHandler);

const port = process.env.PORT || 4000;
connectDb()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Backend server running on port ${port}`);
    });
  })
  .catch((err) => {
    logger.fatal({ err }, "Failed to connect to DB");
    process.exit(1);
  });
