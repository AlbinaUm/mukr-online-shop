import { z } from 'zod';

export const createProductSchema = z.object({
    title: z
        .string({
            required_error: 'Поле "title" обязательно',
        })
        .min(1, 'Поле "title" не может быть пустым'),

    description: z
        .string({
            required_error: 'Поле "description" обязательно',
        })
        .min(1, 'Поле "description" не может быть пустым'),

    price: z
        .number({
            required_error: 'Поле "price" обязательно',
            invalid_type_error: 'Поле "price" должно быть числом',
        })
        .positive('Цена должна быть положительной'),

    visible: z.boolean().optional(),

    categoryIds: z
        .array(z.number().int().positive(), {
            required_error: 'Необходимо указать хотя бы одну категорию',
        })
        .min(1, 'Необходимо указать хотя бы одну категорию'),

});
