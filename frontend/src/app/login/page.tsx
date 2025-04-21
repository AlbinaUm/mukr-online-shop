'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from "@/components/UI/Button/Button";

const schema = z.object({
    email: z.string().email("Неверный формат email").nonempty("Email обязателен"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов").nonempty("Пароль обязателен"),
});

interface LoginFields {
    email: string;
    password: string;
}

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: LoginFields) => {
        console.log('Отправка данных', data);
    };

    return (
        <div className="max-w-lg mx-auto mt-6 p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Вход</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email?.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password?.message}</p>}
                </div>

                <div className="flex justify-center">
                    <Button text="Войти" type="submit"/>
                </div>
            </form>
        </div>
    );
}
