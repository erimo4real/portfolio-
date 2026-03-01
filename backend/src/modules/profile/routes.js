import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getPublicProfile, getMainProfileForAdmin, adminCreateProfile, adminListProfiles, adminPublishProfile, adminUnpublishProfile, adminUpdateProfile } from "./service.js";
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
    const filename = `${file.fieldname}-${unique}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export const profileRouter = express.Router();

profileRouter.get("/", async (req, res, next) => {
  try {
    const p = await getPublicProfile();
    res.json(p || {});
  } catch (err) {
    next(err);
  }
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});

profileRouter.get("/admin", requireAdmin, validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const list = await adminListProfiles(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

profileRouter.get("/admin/main", requireAdmin, async (req, res, next) => {
  try {
    const profile = await getMainProfileForAdmin(req.adminId);
    res.json(profile || {});
  } catch (err) {
    console.error('Error in GET /profile/admin/main:', err);
    res.json({
      id: null,
      name: '',
      headline: '',
      bioMarkdown: '',
      status: 'draft',
      imagePath: null
    });
  }
});

const profileCreateBody = z.object({
  name: z.string().optional(),
  headline: z.string().min(1),
  bioMarkdown: z.string().optional(),
  status: z.enum(["draft","published"]).optional()
});

profileRouter.post("/admin", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const { headline, bioMarkdown, status, name } = req.body;
    
    let validatedHeadline = headline;
    if (!headline || headline.trim() === '') {
      validatedHeadline = 'Profile';
    }
    
    try {
      profileCreateBody.parse({ 
        headline: validatedHeadline, 
        bioMarkdown, 
        status,
        name
      });
    } catch (validationErr) {
      validationErr.status = 400;
      return next(validationErr);
    }
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    const created = await adminCreateProfile({ 
      headline: validatedHeadline, 
      bioMarkdown, 
      status, 
      imagePath,
      name
    }, req.adminId);
    res.json(created);
  } catch (err) {
    console.error('Error in POST /profile/admin:', err);
    next(err);
  }
});

const profileUpdateParams = z.object({ id: z.string().min(1) });
const profileUpdateBody = profileCreateBody.partial();

profileRouter.put("/admin/:id", requireAdmin, upload.single("image"), validate(profileUpdateParams, "params"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { headline, bioMarkdown, status, name } = req.body;
    
    try {
      profileUpdateBody.parse({ headline, bioMarkdown, status, name });
    } catch (validationErr) {
      validationErr.status = 400;
      return next(validationErr);
    }
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    // If no new image, don't update imagePath (keep existing)
    const updateData = { headline, bioMarkdown, status, name };
    if (imagePath) {
      updateData.imagePath = imagePath;
    }
    
    const updated = await adminUpdateProfile(id, updateData, req.adminId);
    res.json(updated);
  } catch (err) {
    console.error('Error in PUT /profile/admin/:id:', err);
    next(err);
  }
});

profileRouter.post("/admin/:id/publish", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await adminPublishProfile(id, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

profileRouter.post("/admin/:id/unpublish", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await adminUnpublishProfile(id, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
