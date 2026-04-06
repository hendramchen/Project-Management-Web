import apiClient from "@/lib/axios";
import {
  Employee,
  EmployeeProfile,
  EmployeeSkill,
  EmployeeProject,
  EmployeeWorkload,
} from "../types";
import {
  EmployeeInput,
  EmployeeSkillInput,
} from "../schemas/employee.schema";

export const employeesApi = {
  getAll: async (): Promise<{ data: Employee[] }> => {
    const response = await apiClient.get<{ data: Employee[] }>("/employees");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Employee }> => {
    const response = await apiClient.get<{ data: Employee }>(
      `/employees/${id}`,
    );
    return response.data;
  },

  getProfile: async (id: string): Promise<{ data: EmployeeProfile }> => {
    const response = await apiClient.get<{ data: EmployeeProfile }>(
      `/employees/${id}/profile`,
    );
    return response.data;
  },

  getSkills: async (id: string): Promise<{ data: EmployeeSkill[] }> => {
    const response = await apiClient.get<{ data: EmployeeSkill[] }>(
      `/employees/${id}/skills`,
    );
    return response.data;
  },

  getProjects: async (id: string): Promise<{ data: EmployeeProject[] }> => {
    const response = await apiClient.get<{ data: EmployeeProject[] }>(
      `/employees/${id}/projects`,
    );
    return response.data;
  },

  getWorkload: async (id: string): Promise<{ data: EmployeeWorkload }> => {
    const response = await apiClient.get<{ data: EmployeeWorkload }>(
      `/employees/${id}/workload`,
    );
    return response.data;
  },

  create: async (data: EmployeeInput): Promise<{ data: Employee }> => {
    const response = await apiClient.post<{ data: Employee }>(
      "/employees",
      data,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<EmployeeInput>,
  ): Promise<{ data: Employee }> => {
    const response = await apiClient.patch<{ data: Employee }>(
      `/employees/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },

  addSkill: async (
    employeeId: string,
    data: EmployeeSkillInput,
  ): Promise<{ data: EmployeeSkill }> => {
    const response = await apiClient.post<{ data: EmployeeSkill }>(
      "/assignments/employee-skills",
      {
        employeeId,
        ...data,
      },
    );
    return response.data;
  },

  updateSkill: async (
    id: string,
    data: Partial<EmployeeSkillInput>,
  ): Promise<{ data: EmployeeSkill }> => {
    const response = await apiClient.patch<{ data: EmployeeSkill }>(
      `/assignments/employee-skills/${id}`,
      data,
    );
    return response.data;
  },

  removeSkill: async (id: string): Promise<void> => {
    await apiClient.delete(`/assignments/employee-skills/${id}`);
  },
};
