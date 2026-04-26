import { z } from 'zod';


const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
    parentId: z.string().regex(objectIdRegex, 'Invalid parentId format').optional()
  })
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    parentId: z.string().regex(objectIdRegex, 'Invalid parentId format').optional().nullable()
  }),
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid category ID format')
  })
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid category ID format')
  })
});
