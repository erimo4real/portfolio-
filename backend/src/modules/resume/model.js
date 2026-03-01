import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    version: { type: String, required: true },
    path: { type: String, required: true },
    active: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", ResumeSchema);
