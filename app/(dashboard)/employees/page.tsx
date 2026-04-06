"use client";

import {
  useEmployees,
  Employee,
  EmployeeInput,
  EmployeeTable,
  EmployeeDialog,
} from "@/features/employees";
import { useAuth, RoleGuard } from "@/features/auth";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EmployeesPage() {
  const {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isCreating,
    isUpdating,
  } = useEmployees();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleSubmit = (data: EmployeeInput) => {
    if (editingEmployee) {
      updateEmployee(
        { id: editingEmployee.id, data },
        {
          onSuccess: () => {
            toast.success("Employee updated successfully");
            handleCloseDialog();
          },
          onError: () => {
            toast.error("Failed to update employee");
          },
        },
      );
    } else {
      createEmployee(data, {
        onSuccess: () => {
          toast.success("Employee created successfully");
          handleCloseDialog();
        },
        onError: () => {
          toast.error("Failed to create employee");
        },
      });
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id, {
        onSuccess: () => {
          toast.success("Employee deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete employee");
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsDialogOpen(true);
  };

  const isManager = user?.role === "admin" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="mt-2 text-muted-foreground">Manage your team members</p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </RoleGuard>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <p className="text-muted-foreground">No employees found</p>
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          isManager={isManager}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EmployeeDialog
        isOpen={isDialogOpen}
        employee={editingEmployee}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
