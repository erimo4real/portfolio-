import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { connectDb } from "../config/db.js";
import { Admin } from "../modules/auth/model.js";
import { Profile } from "../modules/profile/model.js";
import { Skill } from "../modules/skills/model.js";
import { Project } from "../modules/projects/model.js";
import { Blog } from "../modules/blog/model.js";
import { Resume } from "../modules/resume/model.js";
import { ContactMessage } from "../modules/contact/model.js";
import { AnalyticsEvent } from "../modules/analytics/model.js";
import { AuditLog } from "../modules/audit/model.js";

dotenv.config();

async function dumpCollection(model, outFile) {
  const docs = await model.find().lean().exec();
  await fs.promises.writeFile(outFile, JSON.stringify(docs, null, 2), "utf8");
}

async function run() {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const baseDir = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "storage", "backups", ts);
  await fs.promises.mkdir(baseDir, { recursive: true });

  await connectDb();

  await dumpCollection(Admin, path.join(baseDir, "admins.json"));
  await dumpCollection(Profile, path.join(baseDir, "profiles.json"));
  await dumpCollection(Skill, path.join(baseDir, "skills.json"));
  await dumpCollection(Project, path.join(baseDir, "projects.json"));
  await dumpCollection(Blog, path.join(baseDir, "blogs.json"));
  await dumpCollection(Resume, path.join(baseDir, "resumes.json"));
  await dumpCollection(ContactMessage, path.join(baseDir, "contacts.json"));
  await dumpCollection(AnalyticsEvent, path.join(baseDir, "analytics.json"));
  await dumpCollection(AuditLog, path.join(baseDir, "audit.json"));

  const uploadsSrc = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "storage", "uploads");
  const uploadsDest = path.join(baseDir, "uploads");
  try {
    await fs.promises.cp(uploadsSrc, uploadsDest, { recursive: true });
  } catch (err) {
    console.warn("Uploads copy skipped:", err.message);
  }

  console.log("Backup completed at", baseDir);
  process.exit(0);
}

run().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});
