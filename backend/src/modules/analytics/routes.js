import express from "express";
import { trackEvent, adminGetStats } from "./service.js";
import { requireAdmin } from "../../middleware/auth.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";

export const analyticsRouter = express.Router();

const trackBody = z.object({
  type: z.enum(["page_view", "project_view", "blog_read", "resume_download"]),
  slug: z.string().optional()
});
analyticsRouter.post("/track", validate(trackBody), async (req, res, next) => {
  try {
    const { type, slug } = req.body;
    await trackEvent(type, slug);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

analyticsRouter.get("/admin/stats", requireAdmin, async (req, res, next) => {
  try {
    const stats = await adminGetStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});
