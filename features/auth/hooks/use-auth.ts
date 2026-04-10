"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth";

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
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.data.accessToken);
      queryClient.setQueryData(["user"], data.data.user);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.data.accessToken);
      queryClient.setQueryData(["user"], data.data.user);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/projects");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
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

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
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
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
  };
}
