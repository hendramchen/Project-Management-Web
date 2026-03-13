"use client";

import { useTasks } from "@/lib/hooks/use-tasks";
import { useAuth } from "@/lib/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskInput } from "@/lib/schemas/task.schema";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useSprints } from "@/lib/hooks/use-sprints";
import { toast } from "sonner";

const statusColumns = [
  { id: "todo", label: "To Do", color: "bg-gray-100" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-100" },
  { id: "in_review", label: "In Review", color: "bg-yellow-100" },
  { id: "done", label: "Done", color: "bg-green-100" },
] as const;

const priorityColors = {
  low: "bg-gray-200 text-gray-800",
  medium: "bg-blue-200 text-blue-800",
  high: "bg-orange-200 text-orange-800",
  urgent: "bg-red-200 text-red-800",
};

export default function TasksPage() {
  const { tasks, isLoading, createTask, updateTask } = useTasks();
  const { employees } = useEmployees();
  const { sprints } = useSprints();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = (data: TaskInput) => {
    createTask(data, {
      onSuccess: () => {
        toast.success("Task created successfully");
        setIsCreateOpen(false);
        reset();
      },
    });
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(
      { id: taskId, data: { status: newStatus as any } },
      {
        onSuccess: () => {
          toast.success("Task status updated");
        },
      },
    );
  };

  const isManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and track task progress
          </p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </RoleGuard>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statusColumns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.id,
            );
            return (
              <div key={column.id} className="rounded-lg border bg-white">
                <div className={`${column.color} rounded-t-lg px-4 py-3`}>
                  <h3 className="font-semibold">{column.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {columnTasks.length} tasks
                  </p>
                </div>
                <div className="space-y-3 p-4">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityColors[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        {task.assignee && (
                          <span className="text-xs text-muted-foreground">
                            {task.assignee.name}
                          </span>
                        )}
                      </div>
                      {(isManager || task.assigneeId === user?.id) && (
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className="mt-2 w-full rounded border border-input bg-background px-2 py-1 text-xs"
                        >
                          {statusColumns.map((col) => (
                            <option key={col.id} value={col.id}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      No tasks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Add Task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  {...register("title")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
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
                <label className="block text-sm font-medium">Assignee</label>
                <select
                  {...register("assigneeId")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Sprint</label>
                <select
                  {...register("sprintId")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">No Sprint</option>
                  {sprints.map((sprint) => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Priority</label>
                  <select
                    {...register("priority")}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    {...register("status")}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    reset();
                  }}
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
