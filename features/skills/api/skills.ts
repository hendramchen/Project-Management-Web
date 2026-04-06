import apiClient from "@/lib/axios";
import { Skill } from "../types";
import { SkillInput } from "../schemas/skill.schema";
import { EmployeeSkill } from "@/features/employees/types";

export const skillsApi = {
  getAll: async (): Promise<{ data: Skill[] }> => {
    const response = await apiClient.get<{ data: Skill[] }>("/skills");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Skill }> => {
    const response = await apiClient.get<{ data: Skill }>(`/skills/${id}`);
    return response.data;
  },

  create: async (data: SkillInput): Promise<{ data: Skill }> => {
    const response = await apiClient.post<{ data: Skill }>("/skills", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<SkillInput>,
  ): Promise<{ data: Skill }> => {
    const response = await apiClient.patch<{ data: Skill }>(
      `/skills/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/skills/${id}`);
  },

  searchBySkill: async (
    skillId: string,
  ): Promise<{ data: EmployeeSkill[] }> => {
    const response = await apiClient.get<{ data: EmployeeSkill[] }>(
      "/assignments/search-by-skill",
      {
        params: { skillId },
      },
    );
    return response.data;
  },
};
