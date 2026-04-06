import apiClient from "@/lib/axios";
import { Project } from "../types";
import { EmployeeProject, SuggestedEmployee } from "@/features/employees/types";
import {
  ProjectInput,
  EmployeeProjectInput,
} from "../schemas/project.schema";

export const projectsApi = {
  getAll: async (): Promise<{ data: Project[] }> => {
    const response = await apiClient.get<{ data: Project[] }>("/projects");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Project }> => {
    const response = await apiClient.get<{ data: Project }>(`/projects/${id}`);
    return response.data;
  },

  getEmployees: async (id: string): Promise<{ data: EmployeeProject[] }> => {
    const response = await apiClient.get<{ data: EmployeeProject[] }>(
      `/projects/${id}/employees`,
    );
    return response.data;
  },

  getTimeline: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/projects/${id}/timeline`);
    return response.data;
  },

  create: async (data: ProjectInput): Promise<{ data: Project }> => {
    const response = await apiClient.post<{ data: Project }>("/projects", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<ProjectInput>,
  ): Promise<{ data: Project }> => {
    const response = await apiClient.patch<{ data: Project }>(
      `/projects/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  assignEmployee: async (
    projectId: string,
    data: EmployeeProjectInput,
  ): Promise<{ data: EmployeeProject }> => {
    const response = await apiClient.post<{ data: EmployeeProject }>(
      "/assignments/employee-projects",
      {
        projectId,
        ...data,
      },
    );
    return response.data;
  },

  updateAssignment: async (
    id: string,
    data: Partial<EmployeeProjectInput>,
  ): Promise<{ data: EmployeeProject }> => {
    const response = await apiClient.patch<{ data: EmployeeProject }>(
      `/assignments/employee-projects/${id}`,
      data,
    );
    return response.data;
  },

  removeEmployee: async (id: string): Promise<void> => {
    await apiClient.delete(`/assignments/employee-projects/${id}`);
  },

  suggestEmployees: async (
    requiredSkills: string[],
  ): Promise<{ data: SuggestedEmployee[] }> => {
    const response = await apiClient.post<{ data: SuggestedEmployee[] }>(
      "/assignments/suggest-employees",
      {
        requiredSkills,
      },
    );
    return response.data;
  },
};
