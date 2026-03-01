import SkillRepositoryHttp from "../infra/SkillRepositoryHttp";
import type { Skill } from "../../../types/skill";

export async function getSkills(): Promise<Skill[]> {
  const repo = new SkillRepositoryHttp();
  return await repo.list();
}
