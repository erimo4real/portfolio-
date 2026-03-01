import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getPublicResume, adminCreateResume, adminListResumes, adminActivateResume, adminDeleteResume } from "./service.js";
import { requireAdmin } from "../../middleware/auth.js";
import { recordAudit } from "../audit/service.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "..", "..", "storage", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `resume-${unique}.pdf`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    cb(Object.assign(new Error("Only PDF files allowed"), { status: 400 }));
  }
});

export const resumeRouter = express.Router();

resumeRouter.get("/", async (req, res, next) => {
  try {
    const r = await getPublicResume();
    res.json(r || {});
  } catch (err) {
    next(err);
  }
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});
resumeRouter.get("/admin", requireAdmin, validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const list = await adminListResumes(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

const resumeCreateBody = z.object({ version: z.string().min(1) });
resumeRouter.post("/admin", requireAdmin, upload.single("file"), validate(resumeCreateBody), async (req, res, next) => {
  try {
    const { version } = req.body;
    if (!req.file) return res.status(400).json({ error: "PDF file required" });
    const created = await adminCreateResume({ version, path: `/uploads/${req.file.filename}` }, req.adminId);
    res.json(created);
  } catch (err) {
    next(err);
  }
});

resumeRouter.post("/admin/:id/activate", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminActivateResume(req.params.id, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

resumeRouter.delete("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    await adminDeleteResume(req.params.id, req.adminId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
