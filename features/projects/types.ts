import { Client } from "@/features/clients/types";

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
