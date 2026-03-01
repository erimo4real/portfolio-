import type { Project } from "../../../types/project";

export interface ProjectRepository {
  listAll(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project>;
}
