// src/schemas/order.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
    address: z
        .string({ required_error: 'Поле "address" обязательно' })
        .min(1, 'Адрес не может быть пустым'),

    city: z
        .string({ required_error: 'Поле "city" обязательно' })
        .min(1, 'Город не может быть пустым'),

    products: z
        .array(
            z.object({
                product_id: z.number().int().positive(),
                count: z.number().int().positive()
            })
        )
        .min(1, 'Необходимо указать хотя бы один товар')
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['NEW', 'ASSEMBLY', 'ON_THE_WAY', 'DELIVERED'], {
        required_error: 'Поле "status" обязательно',
        invalid_type_error: 'Недопустимый статус'
    })
});