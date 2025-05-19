import { z } from 'zod';

export const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    shortDescription: z.string({
      required_error: 'Short Description is required',
    }),
    description: z.string({
      required_error: 'Description is required',
    }),
    isFeatured: z.boolean().default(false),
    topic: z.string({
      required_error: 'Topic is required',
    }),
    readingTime: z.string({
      required_error: 'Reading Time is required',
    }),
    publishDate: z.string({
      required_error: 'Publish Date & Time is required',
    }),
    category: z.string({
      required_error: 'Category is required',
    }),
    brand: z.array(z.string({
      required_error: 'Each brand must be a string',
    }), {
      required_error: 'Brand is required',
    }),
  }),
});

const updateblogZodSchema = z.object({
    title: z.string().optional(),
    shortDescription: z.string().optional(),
    description: z.string().optional(),
    isFeatured: z.boolean().optional(),
    topic: z.string().optional(),
    readingTime: z.string().optional(),
    publishDate: z.string().optional(),
    category: z.string().optional(),
    brand: z.array(z.string()).optional(),
});


export const BlogValidation = {
    createBlogZodSchema,
    updateblogZodSchema
}