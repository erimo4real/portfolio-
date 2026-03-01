import { get } from "../../../shared/http/apiClient.js";
import { ResumeRepository } from "../domain/resumeRepository.js";

export default class ResumeRepositoryHttp extends ResumeRepository {
  async getActive() {
    return await get("/resume");
  }
}
