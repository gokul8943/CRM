import { z } from 'zod';

export const createContactSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required'),

    lastName: z
        .string()
        .min(1, 'Last name is required'),

    email: z
        .string()
        .email('Invalid email format'),

    phone: z
        .string()
        .optional(),

    company: z
        .string()
        .optional(),

    jobTitle: z
        .string()
        .optional(),

    status: z
        .enum(['ACTIVE', 'INACTIVE'])
        .optional(),

    source: z
        .string()
        .optional(),

    notes: z
        .string()
        .optional(),
});

export const updateContactSchema =
    createContactSchema.partial();