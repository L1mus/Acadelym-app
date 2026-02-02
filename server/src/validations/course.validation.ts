import z from 'zod';

export const coursesSchema =
    z.object({
        page: z
            .coerce.number()
            .positive()
            .min(1)
            .default(1),
        limit: z
            .coerce.number()
            .min(1)
            .max(100, {message: 'Maximum number of courses'})
            .default(9),
        search:z
            .string()
            .trim()
            .optional(),
        category_id:z
            .coerce.number()
            .int({message: 'Category ID should be integer.'})
            .positive()
            .optional(),
        sort:z
            .enum(['lowest_price','highest_price','alphabet_asc','alphabet_desc','lowest_rating','highest_rating'])
            .optional()
})

export const courseDetailBySlugSchema = z.object({
        slug:z
            .string()
            .min(3)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Incorrect slug format (only lowercase letters, numbers, and hyphens)" })
});

export const courseQuerySchema = z.object({
    query : coursesSchema
})

export const courseDetailByIdSchema = z.object({
        id: z.coerce.number().positive()
});


export const courseSlugSchema = z.object({
    params: courseDetailBySlugSchema
})


export const courseIdSchema = z.object({
    params: courseDetailByIdSchema
})


export type CourseQueryDTO = z.infer<typeof courseQuerySchema>['query'];
export type CourseSlugDTO = z.infer<typeof courseSlugSchema>['params'];
export type CourseIdDTO = z.infer<typeof courseIdSchema>['params'];