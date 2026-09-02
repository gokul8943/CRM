import { z } from 'zod';

export const createLeadSchema = z.object({
  contact: z
    .string()
    .min(1, 'Contact is required'),

  title: z
    .string()
    .min(1, 'Lead title is required'),

  status: z
    .enum([
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'LOST',
    ])
    .optional(),

  source: z
    .string()
    .optional(),

  value: z
    .number()
    .min(0, 'Lead value cannot be negative')
    .optional(),

  description: z
    .string()
    .optional(),

  assignedTo: z
    .string()
    .optional(),
});

export const updateLeadSchema =
  createLeadSchema.partial();