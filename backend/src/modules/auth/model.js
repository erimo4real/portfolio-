import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, index: true, unique: true, sparse: true },
    phone: { type: String, index: true, unique: true, sparse: true },
    passwordHash: { type: String },
    googleId: { type: String, index: true, unique: true, sparse: true },
    avatar: { type: String }
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", AdminSchema);
