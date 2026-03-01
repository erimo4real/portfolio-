import type { Profile } from "../../../types/profile";

export interface ProfileRepository {
  get(): Promise<Profile | null>;
}
