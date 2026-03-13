import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
});

export type SkillInput = z.infer<typeof skillSchema>;
