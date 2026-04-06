"use client";

import { Employee } from "@/lib/types";
import { DataTable } from "../data-table";
import { getEmployeeColumns } from "../columns";

interface EmployeeTableProps {
  employees: Employee[];
  isManager: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeTable({
  employees,
  isManager,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const columns = getEmployeeColumns({
    isManager,
    handleEdit: onEdit,
    handleDelete: onDelete,
  });

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={employees} />
      </div>
    </div>
  );
}
