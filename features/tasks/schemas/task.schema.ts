import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  sprintId: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'in_review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.string().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
