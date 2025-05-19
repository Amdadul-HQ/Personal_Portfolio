import { z } from 'zod';

const createExperienceZodSchema = z.object({
  body: z.object({
    role: z.string({
      required_error: 'Role is required',
    }),
    company: z.string({
      required_error: 'Company name is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    skill: z.array(z.string({
      required_error: 'Each skill must be a string',
    }), {
      required_error: 'Skills are required',
    }),
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string({
      required_error: 'End date is required',
    }),
    userId: z.string({
      required_error: 'User ID is required',
    }),
  }),
});

const updateExperienceZodSchema = z.object({
  body: z.object({
    role: z.string().optional(),
    company: z.string().optional(),
    description: z.string().optional(),
    skill: z.array(z.string()).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    userId: z.string().optional(),
  }),
});

export const ExperienceValidation = {
    createExperienceZodSchema,
    updateExperienceZodSchema
}