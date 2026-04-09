"use client";

import { Project } from "../types";
import { Sprint } from "@/features/sprints/types";
import { DataTable } from "@/app/(dashboard)/products/data-table";
import {
  getProjectColumns,
  ProjectRow,
} from "@/app/(dashboard)/products/columns";

interface ProjectTableProps {
  projects: Project[];
  sprints: Sprint[];
  isManager: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAssignEmployee: (project: Project) => void;
}

export default function ProjectTable({
  projects,
  sprints,
  isManager,
  onEdit,
  onDelete,
  onAssignEmployee,
}: ProjectTableProps) {
  const columns = getProjectColumns({
    isManager,
    handleEdit: onEdit,
    handleDelete: onDelete,
    handleAssignEmployee: onAssignEmployee,
  });

  const rows: ProjectRow[] = projects.map((project) => {
    const activeSprint = sprints.find(
      (s) => s.projectId === project.id && s.status === "active",
    );
    return {
      ...project,
      clientName: project.client?.name || "",
      activeSprint,
    };
  });

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
