import mongoose from "mongoose";

const ProjectImageSchema = new mongoose.Schema(
  {
    path: String,
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true, unique: true },
    descriptionMarkdown: String,
    techStack: [String],
    status: { type: String, enum: ["idea", "in_progress", "completed"], default: "idea" },
    images: [ProjectImageSchema],
    order: { type: Number, default: 0 },
    githubUrl: String,
    demoUrl: String,
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    understanding: String,
    contribution: String
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", ProjectSchema);
