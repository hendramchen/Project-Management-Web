"use client";

import { useSprints, sprintSchema, SprintInput } from "@/features/sprints";
import { useProjects } from "@/features/projects";
import { useAuth, RoleGuard } from "@/features/auth";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const statusColors = {
  planning: "bg-gray-200 text-gray-800",
  active: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
};

export default function SprintsPage() {
  const { sprints, isLoading, createSprint, updateSprint, deleteSprint } =
    useSprints();
  const { projects } = useProjects();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SprintInput>({
    resolver: zodResolver(sprintSchema),
  });

  const onSubmit = (data: SprintInput) => {
    if (editingSprint) {
      updateSprint(
        { id: editingSprint.id, data },
        {
          onSuccess: () => {
            toast.success("Sprint updated successfully");
            setEditingSprint(null);
            reset();
            setIsCreateOpen(false);
          },
        },
      );
    } else {
      createSprint(data, {
        onSuccess: () => {
          toast.success("Sprint created successfully");
          setIsCreateOpen(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (sprint: any) => {
    setEditingSprint(sprint);
    setIsCreateOpen(true);
    reset(sprint);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this sprint?")) {
      deleteSprint(id, {
        onSuccess: () => {
          toast.success("Sprint deleted successfully");
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingSprint(null);
    reset();
  };

  const isManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sprints</h1>
          <p className="mt-2 text-muted-foreground">
            Track sprint progress and goals
          </p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Sprint
          </button>
        </RoleGuard>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">Loading sprints...</p>
        </div>
      ) : sprints.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">No sprints found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sprints.map((sprint) => (
            <div
              key={sprint.id}
              className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{sprint.name}</h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[sprint.status]}`}
                  >
                    {sprint.status}
                  </span>
                  {sprint.goal && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {sprint.goal}
                    </p>
                  )}
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p>
                      Start: {new Date(sprint.startDate).toLocaleDateString()}
                    </p>
                    <p>End: {new Date(sprint.endDate).toLocaleDateString()}</p>
                    {sprint.project && (
                      <p className="font-medium text-foreground">
                        {sprint.project.name}
                      </p>
                    )}
                  </div>
                </div>
                <RoleGuard allowedRoles={["admin", "manager"]}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(sprint)}
                      className="rounded p-1 hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(sprint.id)}
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
              {editingSprint ? "Edit Sprint" : "Add Sprint"}
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
                <label className="block text-sm font-medium">Goal</label>
                <textarea
                  {...register("goal")}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Project</label>
                <select
                  {...register("projectId")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.projectId.message}
                  </p>
                )}
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
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {editingSprint ? "Update" : "Create"}
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
