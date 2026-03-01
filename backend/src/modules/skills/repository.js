import { Skill } from "./model.js";

export function listPublicSkills() {
  return Skill.find({ published: true }).sort({ category: 1, order: 1, name: 1 }).exec();
}

export async function listAllSkills(opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(1000, Math.max(1, Number(opts.pageSize) || 1000));
  
  const totalDocs = await Skill.countDocuments();
  const docs = await Skill.find()
    .sort({ category: 1, order: 1, name: 1 })
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

export function createSkill(data) {
  const doc = new Skill(data);
  return doc.save();
}

export function updateSkill(id, data) {
  return Skill.findByIdAndUpdate(id, data, { new: true }).exec();
}

export function deleteSkill(id) {
  return Skill.findByIdAndDelete(id).exec();
}

export async function reorderSkills(category, idOrder) {
  const bulk = idOrder.map((id, idx) => ({
    updateOne: { filter: { _id: id, category }, update: { $set: { order: idx } } }
  }));
  return Skill.bulkWrite(bulk);
}
