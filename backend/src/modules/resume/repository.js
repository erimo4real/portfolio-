import { Resume } from "./model.js";

export function getActiveResume() {
  return Resume.findOne({ active: true }).sort({ updatedAt: -1 }).exec();
}

export async function listResumes(opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(1000, Math.max(1, Number(opts.pageSize) || 1000));
  
  const totalDocs = await Resume.countDocuments();
  const docs = await Resume.find()
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();
  
  return {
    docs,
    totalDocs,
    page,
    pageSize,
    totalPages: Math.ceil(totalDocs / pageSize)
  };
}

export function createResume(data) {
  const doc = new Resume(data);
  return doc.save();
}

export function updateResume(id, data) {
  return Resume.findByIdAndUpdate(id, data, { new: true }).exec();
}

export function deactivateAll() {
  return Resume.updateMany({}, { $set: { active: false } }).exec();
}

export function deleteResume(id) {
  return Resume.findByIdAndDelete(id).exec();
}
