import { z } from 'zod';

export const createWarehouseSchema = z.object({
    title: z.string({ required_error: 'Поле "title" обязательно' }).min(1),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
});

export const updateWarehouseSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
});

export const updateWarehouseProductsSchema = z.object({
    products: z.array(
        z.object({
            product_id: z.number().int().positive(),
            count: z.number().int(),
        })
    ).min(1, 'Необходимо указать хотя бы один товар'),
});
