"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks";
import { TaskInput } from "../schemas/task.schema";
import { Task } from "../types";

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInput> }) =>
      tasksApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old: Task[] = []) =>
        old.map((task) => (task.id === id ? { ...task, ...data } : task)),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old: Task[] = []) =>
        old.filter((task) => task.id !== id),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks: tasks?.data || [],
    isLoading,
    createTask: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useTask(id: string) {
  const { data: task, isLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });

  return {
    task: task?.data,
    isLoading,
  };
}
