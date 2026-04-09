"use client";

import { use } from "react";
import { useProject } from "@/features/projects";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusColors: Record<string, string> = {
  planning: "bg-gray-100 text-gray-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { project, employees, isLoading, isLoadingEmployees } = useProject(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const employeeList = (employees as any)?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
              statusColors[project.status] || ""
            }`}
          >
            {project.status?.replace("_", " ")}
          </span>
        </div>
        {project.description && (
          <p className="mt-2 text-muted-foreground">{project.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Client
              </label>
              <p className="mt-1">{project.client?.name || "No client"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Start Date
              </label>
              <p className="mt-1">{formatDate(project.startDate)}</p>
            </div>
            {project.endDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  End Date
                </label>
                <p className="mt-1">{formatDate(project.endDate)}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <p className="mt-1 capitalize">
                {project.status?.replace("_", " ")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEmployees ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : employeeList.length > 0 ? (
              <div className="space-y-3">
                {employeeList.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="rounded-lg border p-3 space-y-1"
                  >
                    <p className="font-medium">
                      {assignment.employee?.firstName}{" "}
                      {assignment.employee?.lastName}
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">
                        {assignment.role?.replace("_", " ")}
                      </span>
                      <span>{assignment.allocationPercentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No employees assigned yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
