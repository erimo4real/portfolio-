import { Profile } from "./model.js";

export function getPublishedProfile() {
  return Profile.findOne({ status: "published" }).sort({ updatedAt: -1 }).exec();
}

export function getProfileById(id) {
  return Profile.findById(id).exec();
}

export function getProfileByAdminId(adminId) {
  return Profile.findOne({ adminId }).exec();
}

export function createOrUpdateProfile(adminId, data) {
  return Profile.findOneAndUpdate(
    { adminId },
    { $set: { ...data, adminId } },
    { new: true, upsert: true, runValidators: true }
  ).exec();
}

export function updateProfile(id, data) {
  return Profile.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function listProfiles(opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(opts.pageSize) || 50));
  
  const query = Profile.find().sort({ updatedAt: -1 });
  
  const totalDocs = await Profile.countDocuments();
  
  const docs = await query
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