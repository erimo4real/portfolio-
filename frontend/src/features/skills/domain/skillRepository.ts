import type { Skill } from "../../../types/skill";

export interface SkillRepository {
  list(): Promise<Skill[]>;
}
