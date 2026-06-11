import { Admin } from "./model.js";

export async function findAdminByEmailOrPhone(identifier) {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const query = { $or: [{ email: escaped }, { phone: escaped }] };
  return Admin.findOne(query).exec();
}

export async function findAdminByGoogleId(googleId) {
  return Admin.findOne({ googleId }).exec();
}

export async function findAdminByEmail(email) {
  return Admin.findOne({ email }).exec();
}

export async function createAdmin({ email, phone, passwordHash, googleId, name, avatar }) {
  const doc = new Admin({ email, phone, passwordHash, googleId, name, avatar });
  return doc.save();
}

export async function updateAdminGoogleId(adminId, googleId, avatar) {
  return Admin.findByIdAndUpdate(adminId, { googleId, avatar }, { new: true }).exec();
}

export async function updateAdminPassword(adminId, passwordHash) {
  return Admin.findByIdAndUpdate(adminId, { passwordHash }, { new: true }).exec();
}

export async function getAdminById(adminId) {
  return Admin.findById(adminId).select('-passwordHash').exec();
}

export async function findAdminByResetTokenHash(hash) {
  return Admin.findOne({ resetTokenHash: hash, resetTokenExpiry: { $gt: new Date() } }).exec();
}

export async function updateAdminResetToken(adminId, resetTokenHash, resetTokenExpiry) {
  return Admin.findByIdAndUpdate(adminId, { resetTokenHash, resetTokenExpiry }, { new: true }).exec();
}

export async function clearAdminResetToken(adminId) {
  return Admin.findByIdAndUpdate(adminId, { $unset: { resetTokenHash: "", resetTokenExpiry: "" } }, { new: true }).exec();
}
