import { z } from 'zod';

export const registerUserSchema = z.object({
    email: z
        .string({ required_error: 'Email обязателен' })
        .email('Неверный формат email'),

    first_name: z
        .string({ required_error: 'Имя обязательно' })
        .min(1, 'Имя не может быть пустым'),

    last_name: z
        .string({ required_error: 'Фамилия обязательна' })
        .min(1, 'Фамилия не может быть пустой'),
    password: z.string().min(6, 'Минимум 6 символов'),
    phone_number: z
        .string({ required_error: 'Номер телефона обязателен' })
        .min(6, 'Номер телефона слишком короткий'),
});

export const loginUserSchema = z.object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(6, 'Минимум 6 символов'),
});