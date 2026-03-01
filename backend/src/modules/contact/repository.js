import { ContactMessage } from "./model.js";

export function createMessage(data) {
  const doc = new ContactMessage(data);
  return doc.save();
}

export async function listMessages(opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const pageSize = Math.min(1000, Math.max(1, Number(opts.pageSize) || 1000));
  
  const totalDocs = await ContactMessage.countDocuments();
  const docs = await ContactMessage.find()
    .sort({ createdAt: -1 })
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

export async function getMessageById(id) {
  return ContactMessage.findById(id).exec();
}

export async function updateMessage(id, data) {
  return ContactMessage.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteMessage(id) {
  return ContactMessage.findByIdAndDelete(id).exec();
}
