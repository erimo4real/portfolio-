import ResumeRepositoryHttp from "../infra/ResumeRepositoryHttp";
import type { Resume } from "../../../types/resume";

export async function getResume(): Promise<Resume | null> {
  const repo = new ResumeRepositoryHttp();
  return await repo.getActive();
}
