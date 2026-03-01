export type Skill = {
  name: string;
  category: "Frontend" | "Backend" | "DevOps" | "Tooling";
  order?: number;
  published?: boolean;
};
