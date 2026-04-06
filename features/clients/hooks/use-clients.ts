"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clientsApi } from "../api/clients";
import { ClientInput } from "../schemas/client.schema";
import { Client } from "../types";

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onMutate: async (newClient) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previous = queryClient.getQueryData(["clients"]);
      queryClient.setQueryData(["clients"], (old: Client[] = []) => [
        ...old,
        { ...newClient, id: "temp-id" } as Client,
      ]);
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["clients"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClientInput> }) =>
      clientsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previous = queryClient.getQueryData(["clients"]);
      queryClient.setQueryData(["clients"], (old: Client[] = []) =>
        old.map((client) =>
          client.id === id ? { ...client, ...data } : client,
        ),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["clients"], context.previous);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previous = queryClient.getQueryData(["clients"]);
      queryClient.setQueryData(["clients"], (old: Client[] = []) =>
        old.filter((client) => client.id !== id),
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["clients"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    clients: clients?.data || [],
    isLoading,
    createClient: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateClient: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteClient: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useClient(id: string) {
  const { data: client, isLoading } = useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientsApi.getById(id),
    enabled: !!id,
  });

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ["clients", id, "dashboard"],
    queryFn: () => clientsApi.getDashboard(id),
    enabled: !!id,
  });

  return {
    client: client?.data,
    dashboard: dashboard?.data,
    isLoading,
    isLoadingDashboard,
  };
}
