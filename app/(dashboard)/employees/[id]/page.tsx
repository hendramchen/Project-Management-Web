"use client";

import { use } from "react";
import { useEmployee } from "@/lib/hooks/use-employees";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profile, skills, projects, workload, isLoading } = useEmployee(id);
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Employee not found</p>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="mt-2 text-muted-foreground">{profile.position}</p>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b">
          <div className="flex gap-4 px-6">
            {["profile", "skills", "projects", "workload"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="mt-1">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Position
                </label>
                <p className="mt-1">{profile.position}</p>
              </div>
              {profile.department && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Department
                  </label>
                  <p className="mt-1">{profile.department}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-3">
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills assigned
                </p>
              ) : (
                skills.map((employeeSkill) => (
                  <div
                    key={employeeSkill.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">{employeeSkill.skill.name}</p>
                      {employeeSkill.skill.description && (
                        <p className="text-sm text-muted-foreground">
                          {employeeSkill.skill.description}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
                      {employeeSkill.proficiencyLevel}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-3">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No projects assigned
                </p>
              ) : (
                projects.map((employeeProject) => (
                  <div
                    key={employeeProject.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {employeeProject.project.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {employeeProject.role}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {employeeProject.allocationPercentage}%
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "workload" && (
            <div className="space-y-4">
              {workload ? (
                <>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Allocation
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {workload.totalAllocation}%
                    </p>
                  </div>
                  <div className="space-y-3">
                    {workload.projects.map((project) => (
                      <div
                        key={project.projectId}
                        className="rounded-md border p-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{project.projectName}</p>
                          <span className="text-sm font-medium">
                            {project.allocationPercentage}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${project.allocationPercentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No workload data available
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
