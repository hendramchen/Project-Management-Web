"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { LoginInput, RegisterInput } from "@/lib/schemas/auth.schema";
import { User } from "@/lib/types";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    enabled:
      typeof window !== "undefined" && !!localStorage.getItem("access_token"),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.accessToken);
      // localStorage.setItem('refresh_token', data.data.refresh_token);
      queryClient.setQueryData(["user"], data.data.user);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.data.accessToken);
      // localStorage.setItem("refresh_token", data.data.refresh_token);
      queryClient.setQueryData(["user"], data.data.user);
      router.push("/dashboard");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    // localStorage.removeItem("refresh_token");
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
    router.push("/login");
  };

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });

  return {
    user: user?.data,
    isLoading,
    isAuthenticated: !!user?.data,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
}
