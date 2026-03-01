import { get } from "../../../shared/http/apiClient.js";
import type { Resume } from "../../../types/resume";
import type { ResumeRepository } from "../domain/resumeRepository";

export default class ResumeRepositoryHttp implements ResumeRepository {
  async getActive(): Promise<Resume | null> {
    return await get("/resume");
  }
}
