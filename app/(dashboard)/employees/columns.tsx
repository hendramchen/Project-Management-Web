"use client";

import { Employee } from "@/features/employees";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

interface DataTableProps {
  isManager: boolean;
  handleEdit: (employee: Employee) => void;
  handleDelete: (employeeId: string) => void;
}

export const getEmployeeColumns = ({
  isManager,
  handleEdit,
  handleDelete,
}: DataTableProps): ColumnDef<Employee>[] => [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      return (
        <Link
          href={`/employees/${row.original.id}`}
          className="text-primary hover:underline font-medium"
        >
          {firstName}
        </Link>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "teamLocation",
    header: "Team Location",
  },
  {
    accessorKey: "employmentStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("employmentStatus") as string;
      const statusColors = {
        active: "bg-green-100 text-green-800",
        resigned: "bg-gray-100 text-gray-800",
        contract: "bg-blue-100 text-blue-800",
      };
      return (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            statusColors[status as keyof typeof statusColors] || ""
          }`}
        >
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const employee = row.original;
      return (
        isManager && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEdit(employee)}
              className="rounded p-1 hover:bg-muted"
              title="Edit employee"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(employee.id)}
              className="rounded p-1 hover:bg-muted"
              title="Delete employee"
            >
              <Trash2Icon className="h-4 w-4 text-red-600" />
            </button>
          </div>
        )
      );
    },
  },
];
