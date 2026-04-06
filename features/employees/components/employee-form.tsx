"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, EmployeeInput } from "../schemas/employee.schema";
import { Employee } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: EmployeeInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeInput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee
      ? {
          firstName: employee.firstName,
          lastName: employee.lastName,
          dateOfBirth: employee.dateOfBirth,
          startWorkingDate: employee.startWorkingDate,
          position: employee.position,
          teamLocation: employee.teamLocation,
          employeeStatus: employee.employeeStatus,
          phone: employee.phone,
          address: employee.address,
          userId: employee.user.id,
        }
      : undefined,
  });

  const employeeStatus = watch("employeeStatus");

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        dateOfBirth: employee.dateOfBirth,
        startWorkingDate: employee.startWorkingDate,
        position: employee.position,
        teamLocation: employee.teamLocation,
        employeeStatus: employee.employeeStatus,
        phone: employee.phone,
        address: employee.address,
        userId: employee.user.id,
      });
    }
  }, [employee, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} placeholder="John" />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} placeholder="Doe" />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            {...register("dateOfBirth", {
              valueAsDate: true,
            })}
          />
          {errors.dateOfBirth && (
            <p className="text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startWorkingDate">Start Working Date</Label>
          <Input
            id="startWorkingDate"
            type="date"
            {...register("startWorkingDate", {
              valueAsDate: true,
            })}
          />
          {errors.startWorkingDate && (
            <p className="text-sm text-red-600">
              {errors.startWorkingDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Input
          id="position"
          {...register("position")}
          placeholder="Software Engineer"
        />
        {errors.position && (
          <p className="text-sm text-red-600">{errors.position.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamLocation">Team Location</Label>
        <Input
          id="teamLocation"
          {...register("teamLocation")}
          placeholder="New York"
        />
        {errors.teamLocation && (
          <p className="text-sm text-red-600">{errors.teamLocation.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeStatus">Employment Status</Label>
        <Select
          id="employeeStatus"
          value={employeeStatus}
          onValueChange={(value: string) =>
            setValue(
              "employeeStatus",
              value as "active" | "resigned" | "contract",
            )
          }
        >
          <SelectItem value="">Select status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="resigned">Resigned</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
        </Select>
        {errors.employeeStatus && (
          <p className="text-sm text-red-600">
            {errors.employeeStatus.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="+1234567890"
          type="tel"
        />
        {errors.phone && (
          <p className="text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="123 Main St, City, State"
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="userId">User ID</Label>
        <Input id="userId" {...register("userId")} placeholder="User ID" />
        {errors.userId && (
          <p className="text-sm text-red-600">{errors.userId.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : employee ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
