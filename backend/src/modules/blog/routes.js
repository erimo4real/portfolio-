import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { listPublicBlogs, getPublicBlog, adminCreateBlog, adminDeleteBlog, adminListBlogs, adminUpdateBlog, adminPublishBlog, adminUnpublishBlog, adminReorderBlogs } from "./service.js";
import { requireAdmin } from "../../middleware/auth.js";
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
    cb(null, `blog-${unique}${ext}`);
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

export const blogRouter = express.Router();

blogRouter.get("/", async (req, res, next) => {
  try {
    const list = await listPublicBlogs();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:slug", async (req, res, next) => {
  try {
    const doc = await getPublicBlog(req.params.slug);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});
blogRouter.get("/admin/all", requireAdmin, validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const list = await adminListBlogs(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

const blogCreateBody = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  markdown: z.string().min(1),
  image: z.string().optional(),
  videoUrl: z.string().optional(),
  published: z.union([z.boolean(), z.string()]).optional(),
  order: z.union([z.number(), z.string()]).optional()
});
blogRouter.post("/admin", requireAdmin, upload.single("image"), validate(blogCreateBody), async (req, res, next) => {
  try {
    const { title, slug, markdown, videoUrl, published, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const publishedVal = published === true || published === "true" ? true : published === false || published === "false" ? false : undefined;
    const orderVal = order ? parseInt(order, 10) : undefined;
    const created = await adminCreateBlog({ 
      title, 
      slug, 
      markdown, 
      image,
      videoUrl, 
      published: publishedVal, 
      order: orderVal
    }, req.adminId);
    res.json(created);
  } catch (err) {
    next(err);
  }
});

const blogUpdateParams = z.object({ id: z.string().min(1) });
const blogUpdateBody = blogCreateBody.partial();
blogRouter.put("/admin/:id", requireAdmin, upload.single("image"), validate(blogUpdateParams, "params"), validate(blogUpdateBody), async (req, res, next) => {
  try {
    const { title, slug, markdown, videoUrl, published, order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const updateData = { title, slug, markdown, videoUrl, order };
    if (image) updateData.image = image;
    if (published !== undefined) {
      updateData.published = published === true || published === "true" ? true : false;
    }
    if (order) updateData.order = parseInt(order, 10);
    const updated = await adminUpdateBlog(req.params.id, updateData, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/admin/:id", requireAdmin, async (req, res, next) => {
  try {
    await adminDeleteBlog(req.params.id, req.adminId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/admin/:id/publish", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminPublishBlog(req.params.id, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/admin/:id/unpublish", requireAdmin, async (req, res, next) => {
  try {
    const updated = await adminUnpublishBlog(req.params.id, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

const reorderBody = z.object({ idOrder: z.array(z.string().min(1)) });
blogRouter.post("/admin/reorder", requireAdmin, validate(reorderBody), async (req, res, next) => {
  try {
    const { idOrder } = req.body;
    await adminReorderBlogs(idOrder, req.adminId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
