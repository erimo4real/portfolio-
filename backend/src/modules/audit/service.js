import { AuditLog } from "./model.js";

export function recordAudit(adminId, action, entity, entityId, payload) {
  try {
    const doc = new AuditLog({ adminId, action, entity, entityId, payload });
    return doc.save();
  } catch (error) {
    console.error('Error in recordAudit:', error);
    return Promise.resolve();
  }
}