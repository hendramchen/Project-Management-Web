import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  clientId: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'on_hold']).default('active'),
});

export const employeeProjectSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  role: z.string().min(1, 'Role is required'),
  allocationPercentage: z.number().min(0).max(100, 'Allocation must be between 0 and 100'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type EmployeeProjectInput = z.infer<typeof employeeProjectSchema>;
