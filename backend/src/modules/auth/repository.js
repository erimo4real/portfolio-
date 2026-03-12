import { Admin } from "./model.js";

export async function findAdminByEmailOrPhone(identifier) {
  const query = { $or: [{ email: identifier }, { phone: identifier }] };
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
