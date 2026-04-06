export enum SkillCategory {
  Backend = "backend",
  Frontend = "frontend",
  DevOps = "devops",
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  category: SkillCategory;
  createdAt: string;
  updatedAt: string;
}

export enum SkillLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Expert = "expert",
}
