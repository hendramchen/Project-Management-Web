import { Sprint } from "@/features/sprints/types";

export enum TaskStatus {
  ToDo = "todo",
  InProgress = "in_progress",
  Done = "done",
}

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  sprintId?: string;
  sprint?: Sprint;
  assigneeEmployeeId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
