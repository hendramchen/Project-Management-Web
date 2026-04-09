"use client";

import { Project } from "@/features/projects";
import { Sprint } from "@/features/sprints";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PencilIcon, Trash2Icon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface ProjectRow extends Project {
  clientName: string;
  activeSprint?: Sprint;
}

interface ProjectColumnsProps {
  isManager: boolean;
  handleEdit: (project: Project) => void;
  handleDelete: (projectId: string) => void;
  handleAssignEmployee: (project: Project) => void;
}

const statusColors: Record<string, string> = {
  planning: "bg-gray-100 text-gray-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
};

export const getProjectColumns = ({
  isManager,
  handleEdit,
  handleDelete,
  handleAssignEmployee,
}: ProjectColumnsProps): ColumnDef<ProjectRow>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <Link
          href={`/products/${row.original.id}`}
          className="text-primary hover:underline font-medium"
        >
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.getValue("clientName") || "—";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${
            statusColors[status] || ""
          }`}
        >
          {status?.replace("_", " ")}
        </span>
      );
    },
  },
  {
    id: "activeSprint",
    header: "Active Sprint",
    cell: ({ row }) => {
      const sprint = row.original.activeSprint;
      if (sprint) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            {sprint.name}
          </span>
        );
      }
      return <span className="text-muted-foreground text-xs">None</span>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      return new Date(row.getValue("startDate") as string).toLocaleDateString();
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.getValue("endDate") as string;
      return endDate
        ? new Date(endDate).toLocaleDateString()
        : "—";
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const project = row.original;
      return (
        isManager && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleAssignEmployee(project)}
              className="rounded p-1 hover:bg-muted"
              title="Assign employee"
            >
              <UserPlus className="h-4 w-4 text-blue-600" />
            </button>
            <button
              onClick={() => handleEdit(project)}
              className="rounded p-1 hover:bg-muted"
              title="Edit project"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(project.id)}
              className="rounded p-1 hover:bg-muted"
              title="Delete project"
            >
              <Trash2Icon className="h-4 w-4 text-red-600" />
            </button>
          </div>
        )
      );
    },
  },
];
