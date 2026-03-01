import { get } from "../../../shared/http/apiClient.js";
import { ProjectRepository } from "../domain/projectRepository.js";

export default class ProjectRepositoryHttp extends ProjectRepository {
  async listAll() {
    return await get("/projects");
  }
  async getBySlug(slug) {
    return await get(`/projects/${slug}`);
  }
}
