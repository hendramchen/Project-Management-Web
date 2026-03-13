import apiClient from "./client";
import { Sprint, SprintProgress } from "@/lib/types";
import { SprintInput } from "@/lib/schemas/sprint.schema";

export const sprintsApi = {
  getAll: async (): Promise<{ data: Sprint[] }> => {
    const response = await apiClient.get<{ data: Sprint[] }>("/sprints");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Sprint }> => {
    const response = await apiClient.get<{ data: Sprint }>(`/sprints/${id}`);
    return response.data;
  },

  getProgress: async (id: string): Promise<{ data: SprintProgress }> => {
    const response = await apiClient.get<{ data: SprintProgress }>(
      `/sprints/${id}/progress`,
    );
    return response.data;
  },

  create: async (data: SprintInput): Promise<{ data: Sprint }> => {
    const response = await apiClient.post<{ data: Sprint }>("/sprints", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<SprintInput>,
  ): Promise<{ data: Sprint }> => {
    const response = await apiClient.patch<{ data: Sprint }>(
      `/sprints/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sprints/${id}`);
  },
};
