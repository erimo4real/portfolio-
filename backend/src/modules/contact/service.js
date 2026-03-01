import { createMessage, listMessages, getMessageById, updateMessage, deleteMessage } from "./repository.js";

export function submitContact(data) {
  return createMessage(data);
}

export async function adminListContacts(opts) {
  const result = await listMessages(opts);
  return {
    ...result,
    docs: result.docs.map(c => ({
      ...c.toObject(),
      id: c._id.toString()
    }))
  };
}

export async function adminUpdateContact(id, data) {
  const updated = await updateMessage(id, data);
  return { ...updated.toObject(), id: updated._id.toString() };
}

export async function adminDeleteContact(id) {
  await deleteMessage(id);
}
