"use client";

import { use, useState } from "react";
import { useEmployee } from "@/features/employees";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddSkillDialog from "@/features/employees/components/add-skill-dialog";
import AddProjectDialog from "@/features/employees/components/add-project-dialog";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    employee,
    skills,
    projects,
    workload,
    isLoading,
    addSkill,
    isAddingSkill,
    assignProject,
    isAssigningProject,
  } = useEmployee(id);

  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Employee not found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/employees"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employees
        </Link>
        <h1 className="text-3xl font-bold">
          {employee.data.firstName} {employee.data.lastName}
        </h1>
        <p className="mt-2 text-muted-foreground">{employee.data.position}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <p className="mt-1">{employee.data.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <p className="mt-1">{employee.data.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </label>
                <p className="mt-1">
                  {employee.data.dateOfBirth
                    ? formatDate(employee.data.dateOfBirth)
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Start Working Date
                </label>
                <p className="mt-1">
                  {formatDate(employee.data.startWorkingDate)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Position
                </label>
                <p className="mt-1">{employee.data.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Team Location
                </label>
                <p className="mt-1">{employee.data.teamLocation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Employment Status
                </label>
                <p className="mt-1 capitalize">
                  {employee.data.employmentStatus}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button
                size="sm"
                onClick={() => setIsSkillDialogOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </CardHeader>
            <CardContent>
              {skills && skills.data.length > 0 ? (
                <div className="space-y-3">
                  {skills.data.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-lg border p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{skill.skill.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {skill.skill.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Level: </span>
                          <span className="capitalize">{skill.level}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Experience:{" "}
                          </span>
                          <span>{skill.yearsOfExperience} years</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <Button
                size="sm"
                onClick={() => setIsProjectDialogOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </CardHeader>
            <CardContent>
              {projects && projects.data.length > 0 ? (
                <div className="space-y-3">
                  {projects.data.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border p-3 space-y-2"
                    >
                      <div>
                        <p className="font-medium">{project.project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.project.client?.name || "No client"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Start Date:{" "}
                          </span>
                          <span>{formatDate(project.project.startDate)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Status:{" "}
                          </span>
                          <span className="capitalize">
                            {project.project.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Role: </span>
                          <span className="capitalize">
                            {project.role.replace("_", " ")}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Allocation:{" "}
                          </span>
                          <span>{project.allocationPercentage}%</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">
                            Assigned:{" "}
                          </span>
                          <span>{formatDate(project.assignedDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No projects assigned yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Total Allocation
                </label>
                <p className="mt-1 text-2xl font-bold">
                  {workload?.data.totalAllocation ?? 0}%
                </p>
              </div>
              {workload?.data.projects && workload.data.projects.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Projects Breakdown
                  </label>
                  <div className="mt-2 space-y-2">
                    {workload.data.projects.map((proj) => (
                      <div
                        key={proj.projectId}
                        className="flex items-center justify-between rounded-lg border p-2"
                      >
                        <span className="text-sm">{proj.projectName}</span>
                        <span className="text-sm font-medium">
                          {proj.allocationPercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddSkillDialog
        open={isSkillDialogOpen}
        onOpenChange={setIsSkillDialogOpen}
        onSubmit={(data) => {
          addSkill(data);
          setIsSkillDialogOpen(false);
        }}
        isSubmitting={isAddingSkill}
      />

      <AddProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onSubmit={(data) => {
          assignProject(data);
          setIsProjectDialogOpen(false);
        }}
        isSubmitting={isAssigningProject}
      />
    </div>
  );
}
