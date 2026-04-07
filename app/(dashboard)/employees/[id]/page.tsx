"use client";

import { use } from "react";
import { useEmployee } from "@/features/employees";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  // const { profile, skills, projects, workload, isLoading } = useEmployee(id);
  const { employee, isLoading } = useEmployee(id);
  const [activeTab, setActiveTab] = useState("profile");

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
                <p className="mt-1">{employee.data.user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Position
                </label>
                <p className="mt-1">{employee.data.position}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
