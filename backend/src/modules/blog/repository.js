import { Blog } from "./model.js";

export function listPublishedBlogs() {
  return Blog.find({ published: true }).sort({ order: 1, createdAt: -1 }).exec();
}

export function getPublishedBySlug(slug) {
  return Blog.findOne({ slug, published: true }).exec();
}

export async function listAllBlogs(opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(1000, Math.max(1, Number(opts.pageSize) || 1000));
  
  const totalDocs = await Blog.countDocuments();
  const docs = await Blog.find()
    .sort({ order: 1, createdAt: -1 })
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

export function createBlog(data) {
  const doc = new Blog(data);
  return doc.save();
}

export function updateBlog(id, data) {
  return Blog.findByIdAndUpdate(id, data, { new: true }).exec();
}

export function deleteBlog(id) {
  return Blog.findByIdAndDelete(id).exec();
}

export function setBlogPublished(id, value) {
  return Blog.findByIdAndUpdate(id, { published: value }, { new: true }).exec();
}

export async function reorderBlogs(idOrder) {
  const bulk = idOrder.map((id, idx) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: idx } } }
  }));
  return Blog.bulkWrite(bulk);
}
