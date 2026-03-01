import { get } from "../../../shared/http/apiClient.js";
import type { Skill } from "../../../types/skill";
import type { SkillRepository } from "../domain/skillRepository";

export default class SkillRepositoryHttp implements SkillRepository {
  async list(): Promise<Skill[]> {
    return await get("/skills");
  }
}
