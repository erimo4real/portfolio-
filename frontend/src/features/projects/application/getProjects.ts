import ProjectRepositoryHttp from "../infra/ProjectRepositoryHttp";
import type { Project } from "../../../types/project";

export async function getProjects(): Promise<Project[]> {
  const repo = new ProjectRepositoryHttp();
  return await repo.listAll();
}
