import apiClient from "@/lib/axios";
import { Task } from "../types";
import { TaskInput } from "../schemas/task.schema";

export const tasksApi = {
  getAll: async (): Promise<{ data: Task[] }> => {
    const response = await apiClient.get<{ data: Task[] }>("/tasks");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Task }> => {
    const response = await apiClient.get<{ data: Task }>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: TaskInput): Promise<{ data: Task }> => {
    const response = await apiClient.post<{ data: Task }>("/tasks", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<TaskInput>,
  ): Promise<{ data: Task }> => {
    const response = await apiClient.patch<{ data: Task }>(
      `/tasks/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
