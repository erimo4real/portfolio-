import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getPublicProfile, getMainProfileForAdmin, adminCreateProfile, adminListProfiles, adminPublishProfile, adminUnpublishProfile, adminUpdateProfile } from "./service.js";
import { requireAdmin } from "../../middleware/auth.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "../../middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Custom upload function using Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        transformation: [{ width: 800, height: 800, crop: "limit" }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

const upload = multer({ 
  storage: multer.memoryStorage(),
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
    logger.error({ err }, 'Error in GET /profile/admin/main');
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
    
    let imagePath;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        imagePath = result.secure_url;
      } catch (uploadErr) {
        logger.error('Cloudinary upload error:', uploadErr);
        return next(uploadErr);
      }
    }
    
    const created = await adminCreateProfile({ 
      headline: validatedHeadline, 
      bioMarkdown, 
      status, 
      imagePath,
      name
    }, req.adminId);
    res.json(created);
  } catch (err) {
    logger.error('Error in POST /profile/admin:', err);
    next(err);
  }
});

const profileUpdateParams = z.object({ id: z.string().min(1) });
const profileUpdateBody = profileCreateBody.partial();

profileRouter.put("/admin/:id", requireAdmin, upload.single("image"), validate(profileUpdateParams, "params"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { headline, bioMarkdown, status, name, removeImage } = req.body;
    
    try {
      profileUpdateBody.parse({ headline, bioMarkdown, status, name });
    } catch (validationErr) {
      validationErr.status = 400;
      return next(validationErr);
    }
    
    const updateData = { headline, bioMarkdown, status, name };
    
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        updateData.imagePath = result.secure_url;
      } catch (uploadErr) {
        logger.error('Cloudinary upload error:', uploadErr);
        return next(uploadErr);
      }
    } else if (removeImage === 'true' || removeImage === true) {
      updateData.imagePath = null;
    }
    
    const updated = await adminUpdateProfile(id, updateData, req.adminId);
    res.json(updated);
  } catch (err) {
    logger.error('Error in PUT /profile/admin/:id:', err);
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
