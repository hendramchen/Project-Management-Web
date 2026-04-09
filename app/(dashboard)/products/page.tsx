"use client";

import {
  useProjects,
  ProjectTable,
  AssignEmployeeDialog,
  projectSchema,
  ProjectInput,
  Project,
} from "@/features/projects";
import { useClients } from "@/features/clients";
import { useSprints } from "@/features/sprints";
import { useAuth, RoleGuard } from "@/features/auth";
import { projectsApi } from "@/features/projects";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmployeeProjectInput } from "@/features/projects";

export default function ProductsPage() {
  const { projects, isLoading, createProject, updateProject, deleteProject } =
    useProjects();
  const { clients } = useClients();
  const { sprints } = useSprints();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [assigningProject, setAssigningProject] = useState<Project | null>(
    null,
  );

  const assignEmployeeMutation = useMutation({
    mutationFn: (data: EmployeeProjectInput & { projectId: string }) => {
      const { projectId, ...rest } = data;
      return projectsApi.assignEmployee(projectId, rest);
    },
    onSuccess: () => {
      toast.success("Employee assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setAssigningProject(null);
    },
    onError: () => {
      toast.error("Failed to assign employee");
    },
  });

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

  const handleEdit = (project: Project) => {
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

  const handleAssignEmployee = (project: Project) => {
    setAssigningProject(project);
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
        <ProjectTable
          projects={projects}
          sprints={sprints}
          isManager={isManager}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignEmployee={handleAssignEmployee}
        />
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

              {/* <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div> */}

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

      <AssignEmployeeDialog
        open={!!assigningProject}
        onOpenChange={(open) => {
          if (!open) setAssigningProject(null);
        }}
        projectName={assigningProject?.name || ""}
        onSubmit={(data) => {
          if (assigningProject) {
            assignEmployeeMutation.mutate({
              ...data,
              projectId: assigningProject.id,
            });
          }
        }}
        isSubmitting={assignEmployeeMutation.isPending}
      />
    </div>
  );
}
