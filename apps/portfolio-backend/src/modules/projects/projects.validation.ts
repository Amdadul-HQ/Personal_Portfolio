import { z } from 'zod';

const createProjectZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Project name is required',
    }),
    description: z.string({
      required_error: 'Project description is required',
    }),
    type: z.string({
      required_error: 'Project type is required',
    }),
    liveLink: z.string({
      required_error: 'Live link is required',
    }).url('Live link must be a valid URL'),
    gitHubLink: z.string({
      required_error: 'GitHub link is required',
    }).url('GitHub link must be a valid URL'),
    siteMockup: z.string({
      required_error: 'Site mockup URL is required',
    }).url('Site mockup must be a valid URL'),
    projectStartDate: z.string({
      required_error: 'Project start date is required',
    }),
    projectEndDate: z.string({
      required_error: 'Project end date is required',
    }),
    elements: z.number({
      required_error: 'Elements count is required',
    }),
    totalCode: z.number({
      required_error: 'Total lines of code is required',
    }),
    isFeatured: z.boolean().optional(),
    features: z.array(z.string({
      required_error: 'Each feature must be a string',
    }), {
      required_error: 'Features are required',
    }),
    services: z.array(z.string({
      required_error: 'Each service must be a string',
    }), {
      required_error: 'Services are required',
    }),
    techonology: z.array(z.string({
      required_error: 'Each technology must be a string',
    }), {
      required_error: 'Technology stack is required',
    }),
    userId: z.string({
      required_error: 'User ID is required',
    }),
  }),
});

const updateProjectZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    liveLink: z.string().url('Live link must be a valid URL').optional(),
    gitHubLink: z.string().url('GitHub link must be a valid URL').optional(),
    siteMockup: z.string().url('Site mockup must be a valid URL').optional(),
    projectStartDate: z.string().optional(),
    projectEndDate: z.string().optional(),
    elements: z.number().optional(),
    totalCode: z.number().optional(),
    isFeatured: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    techonology: z.array(z.string()).optional(),
    userId: z.string().optional(),
  }),
});


export const ProjectValidation = {
    createProjectZodSchema,
    updateProjectZodSchema
}