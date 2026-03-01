import ProfileRepositoryHttp from "../infra/ProfileRepositoryHttp";
import type { Profile } from "../../../types/profile";

export async function getProfile(): Promise<Profile | null> {
  const repo = new ProfileRepositoryHttp();
  return await repo.get();
}
