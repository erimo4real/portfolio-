import { createResume, deactivateAll, getActiveResume, listResumes, updateResume, deleteResume } from "./repository.js";
import { recordAudit } from "../audit/service.js";

export async function getPublicResume() {
  const r = await getActiveResume();
  if (!r) return null;
  return { version: r.version, path: r.path };
}

export async function adminListResumes(opts) {
  const result = await listResumes(opts);
  return {
    ...result,
    docs: result.docs.map(r => ({
      ...r.toObject(),
      id: r._id.toString()
    }))
  };
}

export async function adminCreateResume(data, adminId) {
  const resume = await createResume(data);
  await recordAudit(adminId, "create", "resume", resume.id, { version: resume.version });
  return { ...resume.toObject(), id: resume._id.toString() };
}

export async function adminActivateResume(id, adminId) {
  await deactivateAll();
  const updated = await updateResume(id, { active: true });
  await recordAudit(adminId, "activate", "resume", id, {});
  return { ...updated.toObject(), id: updated._id.toString() };
}

export async function adminDeleteResume(id, adminId) {
  await deleteResume(id);
  await recordAudit(adminId, "delete", "resume", id, {});
}
