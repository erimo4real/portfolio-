import { createSkill, deleteSkill, listAllSkills, listPublicSkills, updateSkill, reorderSkills } from "./repository.js";
import { recordAudit } from "../audit/service.js";

export async function getPublicSkillsGrouped() {
  const items = await listPublicSkills();
  const grouped = { Frontend: [], Backend: [], DevOps: [], Tooling: [] };
  for (const s of items) grouped[s.category].push({ id: s.id, name: s.name });
  return grouped;
}

export async function adminListSkills(opts) {
  const result = await listAllSkills(opts);
  return {
    ...result,
    docs: result.docs.map(skill => ({
      ...skill.toObject(),
      id: skill._id.toString()
    }))
  };
}

export async function adminCreateSkill(data, adminId) {
  const skill = await createSkill(data);
  await recordAudit(adminId, "create", "skill", skill.id, { name: skill.name });
  return { ...skill.toObject(), id: skill._id.toString() };
}

export async function adminUpdateSkill(id, data, adminId) {
  const skill = await updateSkill(id, data);
  await recordAudit(adminId, "update", "skill", id, { name: data.name });
  return { ...skill.toObject(), id: skill._id.toString() };
}

export async function adminDeleteSkill(id, adminId) {
  await deleteSkill(id);
  await recordAudit(adminId, "delete", "skill", id, {});
}

export async function adminReorderSkills(category, idOrder, adminId) {
  await reorderSkills(category, idOrder);
  await recordAudit(adminId, "reorder", "skill", "", { category, idOrder });
}
