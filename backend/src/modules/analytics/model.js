import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["page_view", "project_view", "blog_read", "resume_download"], index: true },
    slug: { type: String, index: true }
  },
  { timestamps: true }
);

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", AnalyticsSchema);
