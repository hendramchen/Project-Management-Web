import apiClient from "./client";
import { Client } from "@/lib/types";
import { ClientInput } from "@/lib/schemas/client.schema";

export const clientsApi = {
  getAll: async (): Promise<{ data: Client[] }> => {
    const response = await apiClient.get<{ data: Client[] }>("/clients");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Client }> => {
    const response = await apiClient.get<{ data: Client }>(`/clients/${id}`);
    return response.data;
  },

  getDashboard: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/clients/${id}/dashboard`);
    return response.data;
  },

  create: async (data: ClientInput): Promise<{ data: Client }> => {
    const response = await apiClient.post<{ data: Client }>("/clients", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<ClientInput>,
  ): Promise<{ data: Client }> => {
    const response = await apiClient.patch<{ data: Client }>(
      `/clients/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};
