import type { Resume } from "../../../types/resume";

export interface ResumeRepository {
  getActive(): Promise<Resume | null>;
}
