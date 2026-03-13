'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sprintsApi } from '@/lib/api/sprints';
import { SprintInput } from '@/lib/schemas/sprint.schema';
import { Sprint } from '@/lib/types';

export function useSprints() {
  const queryClient = useQueryClient();

  const { data: sprints = [], isLoading } = useQuery({
    queryKey: ['sprints'],
    queryFn: sprintsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: sprintsApi.create,
    onMutate: async (newSprint) => {
      await queryClient.cancelQueries({ queryKey: ['sprints'] });
      const previous = queryClient.getQueryData(['sprints']);
      queryClient.setQueryData(['sprints'], (old: Sprint[] = []) => [...old, { ...newSprint, id: 'temp-id' } as Sprint]);
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['sprints'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SprintInput> }) =>
      sprintsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['sprints'] });
      const previous = queryClient.getQueryData(['sprints']);
      queryClient.setQueryData(['sprints'], (old: Sprint[] = []) =>
        old.map((sprint) => (sprint.id === id ? { ...sprint, ...data } : sprint))
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['sprints'], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
      queryClient.invalidateQueries({ queryKey: ['sprints', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sprintsApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['sprints'] });
      const previous = queryClient.getQueryData(['sprints']);
      queryClient.setQueryData(['sprints'], (old: Sprint[] = []) =>
        old.filter((sprint) => sprint.id !== id)
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['sprints'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });

  return {
    sprints,
    isLoading,
    createSprint: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateSprint: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteSprint: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useSprint(id: string) {
  const { data: sprint, isLoading } = useQuery({
    queryKey: ['sprints', id],
    queryFn: () => sprintsApi.getById(id),
    enabled: !!id,
  });

  const { data: progress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ['sprints', id, 'progress'],
    queryFn: () => sprintsApi.getProgress(id),
    enabled: !!id,
  });

  return {
    sprint,
    progress,
    isLoading,
    isLoadingProgress,
  };
}
