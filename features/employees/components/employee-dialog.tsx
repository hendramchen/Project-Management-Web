"use client";

import { Employee } from "../types";
import { EmployeeInput } from "../schemas/employee.schema";
import EmployeeForm from "./employee-form";

interface EmployeeDialogProps {
  isOpen: boolean;
  employee?: Employee | null;
  onClose: () => void;
  onSubmit: (data: EmployeeInput) => void;
  isSubmitting?: boolean;
}

export default function EmployeeDialog({
  isOpen,
  employee,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EmployeeDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>
        <EmployeeForm
          employee={employee}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
