import { Project } from "./model.js";

export function listPublicProjects() {
  return Project.find({ published: true }).sort({ featured: -1, order: 1, updatedAt: -1 }).exec();
}

export function getProjectBySlug(slug) {
  return Project.findOne({ slug, published: true }).exec();
}

export async function listAllProjects(opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(1000, Math.max(1, Number(opts.pageSize) || 1000));
  
  const totalDocs = await Project.countDocuments();
  const docs = await Project.find()
    .sort({ featured: -1, order: 1, updatedAt: -1 })
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

export function setProjectPublished(id, value) {
  return Project.findByIdAndUpdate(id, { published: value }, { new: true }).exec();
}

export function setProjectFeatured(id, value) {
  return Project.findByIdAndUpdate(id, { featured: value }, { new: true }).exec();
}

export async function reorderProjects(idOrder) {
  const bulk = idOrder.map((id, idx) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: idx } } }
  }));
  return Project.bulkWrite(bulk);
}

export function createProject(data) {
  const doc = new Project(data);
  return doc.save();
}

export function updateProject(id, data) {
  return Project.findByIdAndUpdate(id, data, { new: true }).exec();
}

export function deleteProject(id) {
  return Project.findByIdAndDelete(id).exec();
}
