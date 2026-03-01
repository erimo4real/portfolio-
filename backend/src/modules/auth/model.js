import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, index: true, unique: true, sparse: true },
    phone: { type: String, index: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", AdminSchema);
