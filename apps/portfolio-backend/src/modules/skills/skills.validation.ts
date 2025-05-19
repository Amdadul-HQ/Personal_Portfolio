import { z } from 'zod';

const createSkillZodSchema = z.object({
  body: z.object({
    field: z.enum(['FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL'], {
      required_error: 'Field is required and must be one of FRONTEND, BACKEND, DEVOPS, TOOL',
    }),
    name: z.string({
      required_error: 'Skill name is required',
    }),
    image: z.string({
      required_error: 'Image URL is required',
    }).url('Image must be a valid URL'),
    userId: z.string({
      required_error: 'User ID is required',
    }),
  }),
});

const updateSkillZodSchema = z.object({
  body: z.object({
    field: z.enum(['FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL']).optional(),
    name: z.string().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    userId: z.string().optional(),
  }),
});



export const SkillsValidation ={
    createSkillZodSchema,
    updateSkillZodSchema
}
