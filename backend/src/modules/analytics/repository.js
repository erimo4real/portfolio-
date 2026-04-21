import { AnalyticsEvent } from "./model.js";
import { Project } from "../projects/model.js";
import { Blog } from "../blog/model.js";
import { Skill } from "../skills/model.js";
import { ContactMessage } from "../contact/model.js";

export function createEvent(data) {
  const doc = new AnalyticsEvent(data);
  return doc.save();
}

export async function getStats() {
  const pipeline = [
    { $group: { _id: { type: "$type", slug: "$slug" }, count: { $sum: 1 } } },
    { $project: { _id: 0, type: "$_id.type", slug: "$_id.slug", count: 1 } }
  ];
  const rows = await AnalyticsEvent.aggregate(pipeline).exec();
  const result = { 
    page_view: 0, 
    project_view: {}, 
    blog_read: {}, 
    resume_download: 0,
    projects: await Project.countDocuments(),
    blogs: await Blog.countDocuments(),
    skills: await Skill.countDocuments(),
    messages: await ContactMessage.countDocuments()
  };
  for (const r of rows) {
    if (r.type === "page_view") result.page_view += r.count;
    else if (r.type === "resume_download") result.resume_download += r.count;
    else if (r.type === "project_view") result.project_view[r.slug || ""] = r.count;
    else if (r.type === "blog_read") result.blog_read[r.slug || ""] = r.count;
  }
  return result;
}
