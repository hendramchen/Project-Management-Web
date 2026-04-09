"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { EmployeeProjectRole } from "@/features/projects/types";

interface AssignEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onSubmit: (data: {
    employeeId: string;
    role: string;
    allocationPercentage: number;
    startDate: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function AssignEmployeeDialog({
  open,
  onOpenChange,
  projectName,
  onSubmit,
  isSubmitting = false,
}: AssignEmployeeDialogProps) {
  const { employees } = useEmployees();
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState<string>(EmployeeProjectRole.Developer);
  const [allocationPercentage, setAllocationPercentage] = useState(100);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    onSubmit({
      employeeId,
      role,
      allocationPercentage,
      startDate,
    });

    setEmployeeId("");
    setRole(EmployeeProjectRole.Developer);
    setAllocationPercentage(100);
    setStartDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Assign Employee to {projectName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <select
              id="employee"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select an employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} — {emp.position}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value={EmployeeProjectRole.Developer}>Developer</option>
              <option value={EmployeeProjectRole.TechLead}>Tech Lead</option>
              <option value={EmployeeProjectRole.PM}>Project Manager</option>
              <option value={EmployeeProjectRole.QA}>QA</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocation">Allocation Percentage</Label>
            <input
              id="allocation"
              type="number"
              min="0"
              max="100"
              value={allocationPercentage}
              onChange={(e) =>
                setAllocationPercentage(parseInt(e.target.value))
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
