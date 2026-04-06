import { Project } from "@/features/projects/types";

export enum SprintStatus {
  Planning = "planning",
  Active = "active",
  Completed = "completed",
}

export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  projectId: string;
  project?: Project;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SprintProgress {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  progressPercentage: number;
}
