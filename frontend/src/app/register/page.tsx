'use client';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import Button from "@/components/UI/Button/Button";

const schema = z.object({
    email: z.string().email("Неверный формат email").nonempty("Email обязателен"),
    first_name: z.string().nonempty("Имя обязательно"),
    last_name: z.string().nonempty("Фамилия обязательна"),
    phone_number: z.string().nonempty("Номер телефона обязателен"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов").nonempty("Пароль обязателен"),
    __confirmPassword: z.string().nonempty("Подтверждение пароля обязательно"),
}).refine((data) => data.password === data.__confirmPassword, {
    message: "Пароли не совпадают",
    path: ["__confirmPassword"],
});

interface UserFields {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    __confirmPassword: string;
}

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<UserFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: UserFields) => {
        console.log(data);
        console.log("Отправка данных", data);
    };

    return (
        <div className="max-w-lg mx-auto mt-6 p-6 bg-white border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Регистрация</h2>
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
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        Имя
                    </label>
                    <input
                        id="first_name"
                        type="text"
                        {...register("first_name")}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.first_name && <p className="text-red-500 text-sm mt-2">{errors.first_name?.message}</p>}
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Фамилия
                    </label>
                    <input
                        id="last_name"
                        type="text"
                        {...register("last_name")}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.last_name && <p className="text-red-500 text-sm mt-2">{errors.last_name?.message}</p>}
                </div>

                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                        Номер телефона
                    </label>
                    <input
                        id="phone_number"
                        type="text"
                        {...register("phone_number")}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.phone_number && <p className="text-red-500 text-sm mt-2">{errors.phone_number?.message}</p>}
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

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Подтвердите пароль
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register("__confirmPassword")}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.__confirmPassword &&
                        <p className="text-red-500 text-sm mt-2">{errors.__confirmPassword?.message}</p>}
                </div>

                <div className="flex justify-center">
                    <Button text="Зарегистрироваться" type="submit"/>
                </div>
            </form>
        </div>
    );
}
