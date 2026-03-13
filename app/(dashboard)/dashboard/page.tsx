"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useEmployees } from "@/lib/hooks/use-employees";
import { useProjects } from "@/lib/hooks/use-projects";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useClients } from "@/lib/hooks/use-clients";
import { Users, Briefcase, CheckSquare, Building2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { employees, isLoading: loadingEmployees } = useEmployees();
  const { projects, isLoading: loadingProjects } = useProjects();
  const { tasks, isLoading: loadingTasks } = useTasks();
  const { clients, isLoading: loadingClients } = useClients();

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager" || isAdmin;

  const myTasks = tasks.filter((task) => task.assigneeEmployeeId === user?.id);
  const activeTasks = myTasks.filter((task) => task.status !== "done");
  const activeProjects = projects.filter((p) => p.status === "active");

  const stats = [
    {
      name: "Total Employees",
      value: employees?.length || 0,
      icon: Users,
      visible: true,
    },
    {
      name: "Active Projects",
      value: activeProjects.length,
      icon: Briefcase,
      visible: true,
    },
    {
      name: user?.role === "employee" ? "My Tasks" : "Total Tasks",
      value: user?.role === "employee" ? myTasks.length : tasks.length,
      icon: CheckSquare,
      visible: true,
    },
    {
      name: "Clients",
      value: clients?.length || 0,
      icon: Building2,
      visible: isManager,
    },
  ];

  const isLoading =
    loadingEmployees || loadingProjects || loadingTasks || loadingClients;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back, {user?.email}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats
          .filter((stat) => stat.visible)
          .map((stat) => (
            <div
              key={stat.name}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {isLoading ? "..." : stat.value}
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          ))}
      </div>

      {user?.role === "employee" && (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">My Active Tasks</h2>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : activeTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active tasks</p>
            ) : (
              activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {task.status.replace("_", " ")} • {task.priority}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isManager && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <div className="mt-4 space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : activeProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active projects
                </p>
              ) : (
                activeProjects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {project.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Task Overview</h2>
            <div className="mt-4 space-y-3">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : (
                <>
                  <div className="flex justify-between rounded-md border p-3">
                    <span className="text-sm font-medium">To Do</span>
                    <span className="text-sm font-bold">
                      {tasks.filter((t) => t.status === "todo").length}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-md border p-3">
                    <span className="text-sm font-medium">In Progress</span>
                    <span className="text-sm font-bold">
                      {tasks.filter((t) => t.status === "in_progress").length}
                    </span>
                  </div>
                  <div className="flex justify-between rounded-md border p-3">
                    <span className="text-sm font-medium">Done</span>
                    <span className="text-sm font-bold">
                      {tasks.filter((t) => t.status === "done").length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
