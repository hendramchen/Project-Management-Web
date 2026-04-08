import { z } from "zod";

const baseEmployeeFields = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().optional(),
  startWorkingDate: z.string(),
  position: z.string().min(2, "Position is required"),
  teamLocation: z.string().min(2, "Team location is required"),
  employmentStatus: z.enum(["active", "resigned", "contract"]),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
};

export const createEmployeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  ...baseEmployeeFields,
});

export const updateEmployeeSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  ...baseEmployeeFields,
});

export const employeeSkillSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeInput = CreateEmployeeInput | UpdateEmployeeInput;
export type EmployeeSkillInput = z.infer<typeof employeeSkillSchema>;
