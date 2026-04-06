import apiClient from "@/lib/axios";
import { AuthResponse, User } from "@/types";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

export const authApi = {
  login: async (data: LoginInput): Promise<{ data: AuthResponse }> => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/auth/login",
      data,
    );
    return response.data;
  },

  register: async (data: RegisterInput): Promise<{ data: AuthResponse }> => {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/auth/register",
      data,
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<{ data: User }> => {
    const response = await apiClient.get<{ data: User }>("/users/me");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<{ data: User }> => {
    const response = await apiClient.patch<{ data: User }>("/users/me", data);
    return response.data;
  },
};
