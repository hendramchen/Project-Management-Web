import { z } from 'zod';

export const sprintSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  goal: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['planning', 'active', 'completed', 'cancelled']).default('planning'),
});

export type SprintInput = z.infer<typeof sprintSchema>;
