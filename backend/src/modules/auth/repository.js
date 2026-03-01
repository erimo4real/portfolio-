import { Admin } from "./model.js";

export async function findAdminByEmailOrPhone(identifier) {
  const query = { $or: [{ email: identifier }, { phone: identifier }] };
  return Admin.findOne(query).exec();
}

export async function createAdmin({ email, phone, passwordHash }) {
  const doc = new Admin({ email, phone, passwordHash });
  return doc.save();
}

export async function updateAdminPassword(adminId, passwordHash) {
  return Admin.findByIdAndUpdate(adminId, { passwordHash }, { new: true }).exec();
}

export async function getAdminById(adminId) {
  return Admin.findById(adminId).select('-passwordHash').exec();
}
