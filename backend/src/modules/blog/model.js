import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true, unique: true },
    markdown: String,
    image: String,
    videoUrl: String,
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", BlogSchema);
