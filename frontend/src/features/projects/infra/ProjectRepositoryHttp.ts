import { get } from "../../../shared/http/apiClient.js";
import type { Project } from "../../../types/project";
import type { ProjectRepository } from "../domain/projectRepository";

export default class ProjectRepositoryHttp implements ProjectRepository {
  async listAll(): Promise<Project[]> {
    return await get("/projects");
  }
  async getBySlug(slug: string): Promise<Project> {
    return await get(`/projects/${slug}`);
  }
}
