import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position is required"),
});

export const employeeSkillSchema = z.object({
  skillId: z.string().min(1, "Skill is required"),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeSkillInput = z.infer<typeof employeeSkillSchema>;
