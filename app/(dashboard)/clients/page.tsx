"use client";

import { useClients, clientSchema, ClientInput } from "@/features/clients";
import { useAuth, RoleGuard } from "@/features/auth";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function ClientsPage() {
  const { clients, isLoading, createClient, updateClient, deleteClient } =
    useClients();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: ClientInput) => {
    if (editingClient) {
      updateClient(
        { id: editingClient.id, data },
        {
          onSuccess: () => {
            toast.success("Client updated successfully");
            setEditingClient(null);
            reset();
            setIsCreateOpen(false);
          },
        },
      );
    } else {
      createClient(data, {
        onSuccess: () => {
          toast.success("Client created successfully");
          setIsCreateOpen(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsCreateOpen(true);
    reset(client);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      deleteClient(id, {
        onSuccess: () => {
          toast.success("Client deleted successfully");
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingClient(null);
    reset();
  };

  const isManager = user?.role === "admin" || user?.role === "manager";

  if (!isManager) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-muted-foreground">
          You don't have permission to view this page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="mt-2 text-muted-foreground">
            Manage client information
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">No clients found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{client.name}</h3>
                  {client.country && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {client.country}
                    </p>
                  )}
                  <div className="mt-3 space-y-2">
                    {client.contactEmail && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{client.contactEmail}</span>
                      </div>
                    )}
                    {client.contactPhone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{client.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(client)}
                    className="rounded p-1 hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="rounded p-1 hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">
              {editingClient ? "Edit Client" : "Add Client"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Contact Person
                </label>
                <input
                  {...register("contactPerson")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  {...register("phone")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Address</label>
                <textarea
                  {...register("address")}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {editingClient ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
