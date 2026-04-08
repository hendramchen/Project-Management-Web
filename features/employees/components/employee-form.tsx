"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "../schemas/employee.schema";
import { Employee } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

interface EmployeeFormProps {
  employee?: Employee | null;
  onSubmit: (data: CreateEmployeeInput | UpdateEmployeeInput) => void;
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
  } = useForm<CreateEmployeeInput | UpdateEmployeeInput>({
    resolver: zodResolver(
      employee ? updateEmployeeSchema : createEmployeeSchema,
    ),
    defaultValues: employee
      ? {
          firstName: employee.firstName,
          lastName: employee.lastName,
          dateOfBirth: employee.dateOfBirth,
          startWorkingDate: employee.startWorkingDate,
          position: employee.position,
          teamLocation: employee.teamLocation,
          employmentStatus: employee.employmentStatus,
          phone: employee.phone,
          address: employee.address,
        }
      : undefined,
  });

  const employmentStatus = watch("employmentStatus");

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        dateOfBirth: employee.dateOfBirth,
        startWorkingDate: employee.startWorkingDate,
        position: employee.position,
        teamLocation: employee.teamLocation,
        employmentStatus: employee.employmentStatus,
        phone: employee.phone,
        address: employee.address,
      } as UpdateEmployeeInput);
    }
  }, [employee, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {employee ? (
        <input type="hidden" {...register("userId")} />
      ) : (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="employee@example.com"
          />
          {"email" in errors && errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      )}
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
              valueAsDate: false,
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
              valueAsDate: false,
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
        <Label htmlFor="employmentStatus">Employment Status</Label>

        <Select
          value={employmentStatus}
          onValueChange={(value: string) =>
            setValue(
              "employmentStatus",
              value as "active" | "resigned" | "contract",
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Employment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resigned">Resigned</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {errors.employmentStatus && (
          <p className="text-sm text-red-600">
            {errors.employmentStatus.message}
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
