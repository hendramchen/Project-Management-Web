"use client";

import { Employee } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        isManager && (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleEdit(employee)}
              className="rounded p-1 hover:bg-muted"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(employee.id)}
              className="rounded p-1 hover:bg-muted"
            >
              <Trash2Icon className="h-4 w-4 text-red-600" />
            </button>
          </div>
        )
      );
    },
  },
];
