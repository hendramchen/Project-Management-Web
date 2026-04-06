import { User } from "@/types";
import { Skill, SkillLevel } from "@/features/skills/types";
import { Project, EmployeeProjectRole } from "@/features/projects/types";

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
