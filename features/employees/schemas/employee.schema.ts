import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.date(),
  startWorkingDate: z.date(),
  position: z.string().min(2, "Position is required"),
  teamLocation: z.string().min(2, "Team location is required"),
  employeeStatus: z.enum(["active", "resigned", "contract"]),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  userId: z.string().min(1, "User is required"),
});

export const employeeSkillSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeSkillInput = z.infer<typeof employeeSkillSchema>;
