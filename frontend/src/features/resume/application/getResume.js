import ResumeRepositoryHttp from "../infra/ResumeRepositoryHttp.js";

export async function getResume() {
  const repo = new ResumeRepositoryHttp();
  return await repo.getActive();
}
