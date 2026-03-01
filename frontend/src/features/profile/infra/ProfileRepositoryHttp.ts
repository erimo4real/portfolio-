import { get } from "../../../shared/http/apiClient.js";
import type { Profile } from "../../../types/profile";
import type { ProfileRepository } from "../domain/profileRepository";

export default class ProfileRepositoryHttp implements ProfileRepository {
  async get(): Promise<Profile | null> {
    return await get("/profile");
  }
}
