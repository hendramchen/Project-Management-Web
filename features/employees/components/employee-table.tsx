"use client";

import { Employee } from "../types";
import { DataTable } from "@/app/(dashboard)/employees/data-table";
import { getEmployeeColumns } from "@/app/(dashboard)/employees/columns";

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
