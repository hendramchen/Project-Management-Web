"use client";

import { useEmployees } from "@/lib/hooks/use-employees";
import { useAuth } from "@/lib/hooks/use-auth";
import { RoleGuard } from "@/components/auth/role-guard";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, EmployeeInput } from "@/lib/schemas/employee.schema";
import { toast } from "sonner";

export default function EmployeesPage() {
  const {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = (data: EmployeeInput) => {
    if (editingEmployee) {
      updateEmployee(
        { id: editingEmployee.id, data },
        {
          onSuccess: () => {
            toast.success("Employee updated successfully");
            setEditingEmployee(null);
            reset();
          },
        },
      );
    } else {
      createEmployee(data, {
        onSuccess: () => {
          toast.success("Employee created successfully");
          setIsCreateOpen(false);
          reset();
        },
      });
    }
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setIsCreateOpen(true);
    reset(employee);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id, {
        onSuccess: () => {
          toast.success("Employee deleted successfully");
        },
      });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingEmployee(null);
    reset();
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
            onClick={() => setIsCreateOpen(true)}
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
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Position
                  </th>
                  {isManager && (
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <Link
                        href={`/employees/${employee.id}`}
                        className="font-medium hover:text-primary"
                      >
                        {employee.firstName + " " + employee.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {employee.user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">{employee.position}</td>
                    {isManager && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="rounded p-1 hover:bg-muted"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="rounded p-1 hover:bg-muted"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  {...register("name")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Position</label>
                <input
                  {...register("position")}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.position.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {editingEmployee ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseDialog}
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
