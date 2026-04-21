import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { listPublic, getPublicBySlug, adminCreate, adminDelete, adminList, adminUpdate, adminPublish, adminUnpublish, adminFeature, adminUnfeature, adminReorder } from "./service.js";
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
    const ext = path.extname(file.originalname);
    cb(null, `project-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (ok) return cb(null, true);
    cb(Object.assign(new Error("Only image files allowed"), { status: 400 }));
  }
});

export const projectsRouter = express.Router();

projectsRouter.get("/", async (req, res, next) => {
  try {
    const list = await listPublic();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:slug", async (req, res, next) => {
  try {
    const p = await getPublicBySlug(req.params.slug);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch (err) {
    next(err);
  }
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});

projectsRouter.get("/admin/all", requireAdmin, validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const list = await adminList(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

const projectCreateBody = z.object({
  title: z.string().min(1),
  descriptionMarkdown: z.string().optional(),
  techStack: z.string().optional(),
  status: z.enum(["idea", "in_progress", "completed"]).optional(),
  githubUrl: z.string().optional().or(z.string().url()),
  demoUrl: z.string().optional().or(z.string().url()),
  featured: z.union([z.string(), z.boolean()]).optional(),
  published: z.union([z.string(), z.boolean()]).optional(),
  understanding: z.string().optional(),
  contribution: z.string().optional()
});

projectsRouter.post("/admin", requireAdmin, upload.array("images"), validate(projectCreateBody), async (req, res, next) => {
  try {
    const { title, descriptionMarkdown, techStack, status, githubUrl, demoUrl, featured, published, understanding, contribution } = req.body;
    const images = (req.files || []).map((f, i) => ({ path: `/uploads/${f.filename}`, order: i }));
    
    let parsedTechStack = [];
    if (techStack) {
      try {
        parsedTechStack = JSON.parse(techStack);
      } catch (e) {
        parsedTechStack = [];
      }
    }
    
    const created = await adminCreate({
      title,
      descriptionMarkdown,
      techStack: parsedTechStack,
      status,
      githubUrl,
      demoUrl,
      featured: featured === "true" || featured === true,
      published: published === "true" || published === true,
      understanding,
      contribution,
      images: images.length > 0 ? images : []
    });
    await recordAudit(req.adminId, "create", "project", created.id, { title });
    res.json(created);
  } catch (err) {
    next(err);
  }
});

const projectUpdateParams = z.object({ id: z.string().min(1) });
const projectUpdateBody = z.object({
  title: z.string().min(1).optional(),
  descriptionMarkdown: z.string().optional(),
  techStack: z.string().optional(),
  status: z.enum(["idea", "in_progress", "completed"]).optional(),
  githubUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  featured: z.union([z.string(), z.boolean()]).optional(),
  published: z.union([z.string(), z.boolean()]).optional(),
  understanding: z.string().optional(),
  contribution: z.string().optional()
});

projectsRouter.put("/admin/:id", requireAdmin, upload.array("images"), validate(projectUpdateParams, "params"), validate(projectUpdateBody), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, descriptionMarkdown, techStack, status, githubUrl, demoUrl, featured, published, understanding, contribution, existingImages } = req.body;
    
    // Parse existing images if provided
    let existingImagesArray = [];
    if (existingImages) {
      try {
        existingImagesArray = JSON.parse(existingImages);
      } catch (e) {
        existingImagesArray = [];
      }
    }
    
    // Get new uploaded images
    const newImages = (req.files || []).map((f, i) => ({ path: `/uploads/${f.filename}`, order: existingImagesArray.length + i }));
    
    // Combine existing and new images
    const allImages = [...existingImagesArray, ...newImages];
    
    const updated = await adminUpdate(id, {
      title,
      descriptionMarkdown,
      techStack: techStack ? JSON.parse(techStack) : undefined,
      status,
      githubUrl,
      demoUrl,
      featured: typeof featured !== "undefined" ? featured === "true" || featured === true : undefined,
      published: typeof published !== "undefined" ? published === "true" || published === true : undefined,
      understanding,
      contribution,
      images: allImages.length > 0 ? allImages : undefined
    });
    await recordAudit(req.adminId, "update", "project", id, { title });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

projectsRouter.delete("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    await adminDelete(req.params.id);
    await recordAudit(req.adminId, "delete", "project", req.params.id, {});
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/admin/:id/publish", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminPublish(req.params.id);
    await recordAudit(req.adminId, "publish", "project", req.params.id, {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/admin/:id/unpublish", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminUnpublish(req.params.id);
    await recordAudit(req.adminId, "unpublish", "project", req.params.id, {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/admin/:id/feature", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminFeature(req.params.id);
    await recordAudit(req.adminId, "feature", "project", req.params.id, {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

projectsRouter.post("/admin/:id/unfeature", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminUnfeature(req.params.id);
    await recordAudit(req.adminId, "unfeature", "project", req.params.id, {});
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

const reorderBody = z.object({ idOrder: z.array(z.string().min(1)) });
projectsRouter.post("/admin/reorder", requireAdmin, validate(reorderBody), async (req, res, next) => {
  try {
    const { idOrder } = req.body;
    await adminReorder(idOrder);
    await recordAudit(req.adminId, "reorder", "project", "", { idOrder });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
