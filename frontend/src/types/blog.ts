export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
