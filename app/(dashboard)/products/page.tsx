"use client";

import { useProjects } from "@/lib/hooks/use-projects";
import { useClients } from "@/lib/hooks/use-clients";
import { useAuth } from "@/lib/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectInput } from "@/lib/schemas/project.schema";
import { toast } from "sonner";

const statusColors = {
  active: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  on_hold: "bg-yellow-200 text-yellow-800",
};

export default function ProductsPage() {
  const { projects, isLoading, createProject, updateProject, deleteProject } =
    useProjects();
  const { clients } = useClients();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data: ProjectInput) => {
    if (editingProject) {
      updateProject(
        { id: editingProject.id, data },
        {
          onSuccess: () => {
            toast.success("Project updated successfully");
            setEditingProject(null);
            reset();
            setIsCreateOpen(false);
          },
        },
      );
    } else {
      createProject(data, {
        onSuccess: () => {
          toast.success("Project created successfully");
          setIsCreateOpen(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsCreateOpen(true);
    reset(project);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id, {
        onSuccess: () => {
          toast.success("Project deleted successfully");
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingProject(null);
    reset();
  };

  const isManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Manage projects and assignments
          </p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </RoleGuard>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{project.name}</h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[project.status]}`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                  {project.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>
                      Start: {new Date(project.startDate).toLocaleDateString()}
                    </p>
                    {project.endDate && (
                      <p>
                        End: {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    )}
                    {project.client && (
                      <p className="font-medium text-foreground">
                        {project.client.name}
                      </p>
                    )}
                  </div>
                </div>
                <RoleGuard allowedRoles={["admin", "manager"]}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(project)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </RoleGuard>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">
              {editingProject ? "Edit Project" : "Add Project"}
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
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Client</label>
                <select
                  {...register("clientId")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No Client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register("startDate")}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">End Date</label>
                  <input
                    type="date"
                    {...register("endDate")}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {editingProject ? "Update" : "Create"}
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
