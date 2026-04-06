"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeesApi } from "../api/employees";
import {
  EmployeeInput,
  EmployeeSkillInput,
} from "../schemas/employee.schema";
import { Employee } from "../types";

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: employeesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: employeesApi.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeInput> }) =>
      employeesApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });
      const previous = queryClient.getQueryData(["employees"]);
      queryClient.setQueryData(["employees"], (old: Employee[] = []) =>
        old.map((emp) => (emp.id === id ? { ...emp, ...data } : emp)),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["employees"], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: employeesApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["employees"] });
      const previous = queryClient.getQueryData(["employees"]);
      queryClient.setQueryData(["employees"], (old: Employee[] = []) =>
        old.filter((emp) => emp.id !== id),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["employees"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return {
    employees: employees?.data || [],
    isLoading,
    createEmployee: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteEmployee: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useEmployee(id: string) {
  const queryClient = useQueryClient();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesApi.getById(id),
    enabled: !!id,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["employees", id, "profile"],
    queryFn: () => employeesApi.getProfile(id),
    enabled: !!id,
  });

  const { data: skills = [], isLoading: isLoadingSkills } = useQuery({
    queryKey: ["employees", id, "skills"],
    queryFn: () => employeesApi.getSkills(id),
    enabled: !!id,
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["employees", id, "projects"],
    queryFn: () => employeesApi.getProjects(id),
    enabled: !!id,
  });

  const { data: workload, isLoading: isLoadingWorkload } = useQuery({
    queryKey: ["employees", id, "workload"],
    queryFn: () => employeesApi.getWorkload(id),
    enabled: !!id,
  });

  const addSkillMutation = useMutation({
    mutationFn: (data: EmployeeSkillInput) => employeesApi.addSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", id, "skills"] });
      queryClient.invalidateQueries({ queryKey: ["employees", id, "profile"] });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({
      skillId,
      data,
    }: {
      skillId: string;
      data: Partial<EmployeeSkillInput>;
    }) => employeesApi.updateSkill(skillId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", id, "skills"] });
      queryClient.invalidateQueries({ queryKey: ["employees", id, "profile"] });
    },
  });

  const removeSkillMutation = useMutation({
    mutationFn: employeesApi.removeSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", id, "skills"] });
      queryClient.invalidateQueries({ queryKey: ["employees", id, "profile"] });
    },
  });

  return {
    employee,
    profile,
    skills,
    projects,
    workload,
    isLoading: isLoading || isLoadingProfile,
    isLoadingSkills,
    isLoadingProjects,
    isLoadingWorkload,
    addSkill: addSkillMutation.mutate,
    isAddingSkill: addSkillMutation.isPending,
    updateSkill: updateSkillMutation.mutate,
    isUpdatingSkill: updateSkillMutation.isPending,
    removeSkill: removeSkillMutation.mutate,
    isRemovingSkill: removeSkillMutation.isPending,
  };
}
