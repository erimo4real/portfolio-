import { AuditLog } from "./model.js";
import { logger } from "../../middleware/error.js";

export function recordAudit(adminId, action, entity, entityId, payload) {
  try {
    const doc = new AuditLog({ adminId, action, entity, entityId, payload });
    return doc.save();
  } catch (error) {
    logger.error({ err: error }, 'Error in recordAudit');
    return Promise.resolve();
  }
}