import { z } from 'zod';

const createSkillZodSchema = z.object({
  body: z.object({
    field: z.enum(['FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL'], {
      required_error: 'Field is required and must be one of FRONTEND, BACKEND, DEVOPS, TOOL',
    }),
    name: z.string({
      required_error: 'Skill name is required',
    }),
  }),
});

const updateSkillZodSchema = z.object({
  body: z.object({
    field: z.enum(['FRONTEND', 'BACKEND', 'DEVOPS', 'TOOL']).optional(),
    name: z.string().optional(),
  }),
});



export const SkillsValidation ={
    createSkillZodSchema,
    updateSkillZodSchema
}
