import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: String,
    category: { type: String, enum: ["Frontend", "Backend", "DevOps", "Tooling"], index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Skill = mongoose.model("Skill", SkillSchema);
