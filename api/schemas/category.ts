import {z, ZodSchema} from "zod";

export const CategorySchema: ZodSchema = z.object({
    title: z.string({
        required_error: 'Поле title обязательно'
    }).min(1, 'Поле "title" не может быть пустым'),

    description: z.string().optional().nullable(),
});