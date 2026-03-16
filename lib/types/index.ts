export type UserRole = "admin" | "manager" | "employee";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  // refresh_token: string;
  user: User;
}

export enum EmploymentStatus {
  Active = "active",
  Resigned = "resigned",
  Contract = "contract",
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  startWorkingDate: Date;
  position: string;
  teamLocation: string;
  employeeStatus: EmploymentStatus;
  phone: string;
  address: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeProfile extends Employee {
  skills: EmployeeSkill[];
  projects: EmployeeProject[];
}

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

export interface EmployeeSkill {
  id: string;
  employeeId: string;
  skillId: string;
  skill: Skill;
  level: SkillLevel;
  yearsOfExperience: number;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  Planning = "planning",
  Active = "active",
  Completed = "completed",
  Paused = "paused",
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  client?: Client;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export enum EmployeeProjectRole {
  Developer = "developer",
  TechLead = "tech_lead",
  PM = "pm",
  QA = "qa",
}

export interface EmployeeProject {
  id: string;
  employeeId: string;
  projectId: string;
  project: Project;
  role: EmployeeProjectRole;
  allocationPercentage: number;
  assignedDate: string;
  releasedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  country?: string;
  industry?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface EmployeeWorkload {
  employeeId: string;
  employee: Employee;
  totalAllocation: number;
  projects: Array<{
    projectId: string;
    projectName: string;
    allocationPercentage: number;
  }>;
}

export interface EmployeeUtilization {
  employeeId: string;
  employeeName: string;
  totalAllocation: number;
  projects: Array<{
    projectId: string;
    projectName: string;
    allocation: number;
  }>;
}

export interface SuggestedEmployee {
  employeeId: string;
  employeeName: string;
  matchScore: number;
  matchingSkills: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
