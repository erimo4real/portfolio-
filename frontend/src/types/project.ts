export type Project = {
  title: string;
  slug: string;
  descriptionMarkdown?: string;
  techStack?: string[];
  status?: "idea" | "in_progress" | "completed";
  images?: { path: string; order: number }[];
  order?: number;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  published?: boolean;
};
