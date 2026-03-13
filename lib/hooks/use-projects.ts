"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "@/lib/api/projects";
import {
  ProjectInput,
  EmployeeProjectInput,
} from "@/lib/schemas/project.schema";
import { Project } from "@/lib/types";

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData(["projects"]);
      queryClient.setQueryData(["projects"], (old: Project[] = []) => [
        ...old,
        { ...newProject, id: "temp-id" } as Project,
      ]);
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectInput> }) =>
      projectsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData(["projects"]);
      queryClient.setQueryData(["projects"], (old: Project[] = []) =>
        old.map((project) =>
          project.id === id ? { ...project, ...data } : project,
        ),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects"], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData(["projects"]);
      queryClient.setQueryData(["projects"], (old: Project[] = []) =>
        old.filter((project) => project.id !== id),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: projects?.data || [],
    isLoading,
    createProject: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useProject(id: string) {
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["projects", id, "employees"],
    queryFn: () => projectsApi.getEmployees(id),
    enabled: !!id,
  });

  const { data: timeline, isLoading: isLoadingTimeline } = useQuery({
    queryKey: ["projects", id, "timeline"],
    queryFn: () => projectsApi.getTimeline(id),
    enabled: !!id,
  });

  const assignEmployeeMutation = useMutation({
    mutationFn: (data: EmployeeProjectInput) =>
      projectsApi.assignEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", id, "employees"],
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: string;
      data: Partial<EmployeeProjectInput>;
    }) => projectsApi.updateAssignment(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", id, "employees"],
      });
    },
  });

  const removeEmployeeMutation = useMutation({
    mutationFn: projectsApi.removeEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", id, "employees"],
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return {
    project: project?.data,
    employees,
    timeline,
    isLoading,
    isLoadingEmployees,
    isLoadingTimeline,
    assignEmployee: assignEmployeeMutation.mutate,
    isAssigning: assignEmployeeMutation.isPending,
    updateAssignment: updateAssignmentMutation.mutate,
    isUpdatingAssignment: updateAssignmentMutation.isPending,
    removeEmployee: removeEmployeeMutation.mutate,
    isRemovingEmployee: removeEmployeeMutation.isPending,
  };
}

export function useSuggestEmployees() {
  const suggestMutation = useMutation({
    mutationFn: projectsApi.suggestEmployees,
  });

  return {
    suggestEmployees: suggestMutation.mutate,
    suggestEmployeesAsync: suggestMutation.mutateAsync,
    suggestions: suggestMutation.data,
    isSuggesting: suggestMutation.isPending,
  };
}
