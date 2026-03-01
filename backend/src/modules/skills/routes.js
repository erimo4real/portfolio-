import express from "express";
import { getPublicSkillsGrouped, adminCreateSkill, adminListSkills, adminUpdateSkill, adminDeleteSkill, adminReorderSkills } from "./service.js";
import { requireAdmin } from "../../middleware/auth.js";
import { recordAudit } from "../audit/service.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";

export const skillsRouter = express.Router();

skillsRouter.get("/", async (req, res, next) => {
  try {
    const grouped = await getPublicSkillsGrouped();
    res.json(grouped);
  } catch (err) {
    next(err);
  }
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});

skillsRouter.get("/admin", requireAdmin, validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const list = await adminListSkills(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

const skillCreateBody = z.object({
  name: z.string().min(1),
  category: z.enum(["Frontend", "Backend", "DevOps", "Tooling"]),
  published: z.boolean().optional(),
  order: z.number().int().min(0).optional()
});

skillsRouter.post("/admin", requireAdmin, validate(skillCreateBody), async (req, res, next) => {
  try {
    const created = await adminCreateSkill(req.body, req.adminId);
    res.json(created);
  } catch (err) {
    next(err);
  }
});

const skillUpdateParams = z.object({ id: z.string().min(1) });
const skillUpdateBody = skillCreateBody.partial();
skillsRouter.put("/admin/:id", requireAdmin, validate(skillUpdateParams, "params"), validate(skillUpdateBody), async (req, res, next) => {
  try {
    const updated = await adminUpdateSkill(req.params.id, req.body, req.adminId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

skillsRouter.delete("/admin/:id", requireAdmin, validate(skillUpdateParams, "params"), async (req, res, next) => {
  try {
    await adminDeleteSkill(req.params.id, req.adminId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

const reorderBody = z.object({
  category: z.enum(["Frontend", "Backend", "DevOps", "Tooling"]),
  idOrder: z.array(z.string().min(1))
});
skillsRouter.post("/admin/reorder", requireAdmin, validate(reorderBody), async (req, res, next) => {
  try {
    const { category, idOrder } = req.body;
    await adminReorderSkills(category, idOrder, req.adminId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
