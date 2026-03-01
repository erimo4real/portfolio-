import express from "express";
import { submitContact, adminListContacts, adminUpdateContact, adminDeleteContact } from "./service.js";
import { requireAdmin } from "../../middleware/auth.js";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";

export const contactRouter = express.Router();

const contactBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1).max(5000)
});
contactRouter.post("/", validate(contactBody), async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    const created = await submitContact({ name, email, message });
    res.json({ id: created.id });
  } catch (err) {
    next(err);
  }
});

const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional()
});
contactRouter.get("/admin", requireAdmin, validate(paginationQuery, "query"), async (req, res, next) => {
  try {
    const list = await adminListContacts(req.query);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

const updateParams = z.object({ id: z.string().min(1) });
const updateBody = z.object({
  read: z.boolean().optional()
});
contactRouter.put("/admin/:id", requireAdmin, validate(updateParams, "params"), validate(updateBody), async (req, res, next) => {
  try {
    const updated = await adminUpdateContact(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

contactRouter.delete("/admin/:id", requireAdmin, validate(updateParams, "params"), async (req, res, next) => {
  try {
    await adminDeleteContact(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
