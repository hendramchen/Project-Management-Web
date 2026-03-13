import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().optional(),
});

export const employeeSkillSchema = z.object({
  skillId: z.string().min(1, 'Skill is required'),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeSkillInput = z.infer<typeof employeeSkillSchema>;
