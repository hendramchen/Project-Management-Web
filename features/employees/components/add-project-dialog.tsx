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
import { useProjects } from "@/features/projects/hooks/use-projects";
import { EmployeeProjectRole } from "@/features/projects/types";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    projectId: string;
    role: EmployeeProjectRole;
    allocationPercentage: number;
    assignedDate: string;
  }) => void;
  isSubmitting?: boolean;
}

export default function AddProjectDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: AddProjectDialogProps) {
  const { projects } = useProjects();
  const [projectId, setProjectId] = useState("");
  const [role, setRole] = useState<EmployeeProjectRole>(EmployeeProjectRole.Developer);
  const [allocationPercentage, setAllocationPercentage] = useState(100);
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    onSubmit({
      projectId,
      role,
      allocationPercentage,
      assignedDate,
    });

    setProjectId("");
    setRole(EmployeeProjectRole.Developer);
    setAllocationPercentage(100);
    setAssignedDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Assign to Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} - {project.status}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as EmployeeProjectRole)}
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
              onChange={(e) => setAllocationPercentage(parseInt(e.target.value))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedDate">Assigned Date</Label>
            <input
              id="assignedDate"
              type="date"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
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
              {isSubmitting ? "Assigning..." : "Assign to Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
