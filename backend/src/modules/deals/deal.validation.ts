import { z } from 'zod';

export const dealStageSchema =
    z.enum([
        'PROSPECTING',
        'QUALIFICATION',
        'PROPOSAL',
        'NEGOTIATION',
        'CLOSED_WON',
        'CLOSED_LOST',
    ]);

export const createDealSchema =
    z.object({
        contact: z
            .string()
            .min(
                1,
                'Contact is required'
            ),

        lead: z
            .string()
            .optional(),

        title: z
            .string()
            .min(
                1,
                'Deal title is required'
            ),

        value: z
            .number()
            .min(
                0,
                'Deal value cannot be negative'
            ),

        stage: dealStageSchema
            .optional(),

        assignedTo: z
            .string()
            .optional(),

        expectedCloseDate: z
            .string()
            .optional(),

        description: z
            .string()
            .optional(),
    });

export const updateDealSchema =
    createDealSchema.partial();

export const updateDealStageSchema =
    z.object({
        stage: dealStageSchema,
    });