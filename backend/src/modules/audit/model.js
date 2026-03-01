import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    adminId: { type: String, index: true },
    action: String,
    entity: String,
    entityId: String,
    payload: Object
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", AuditSchema);
