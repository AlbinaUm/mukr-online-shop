import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import Button from "@/components/UI/Button/Button";

// Тип для каждого поля формы
interface FormField {
    name: string;
    label: string;
    type: string;
    validation?: object;
}

// Тип для конфигурации формы
interface FormConfig {
    fields: FormField[];
    onSubmit: SubmitHandler<FieldValues>;
}

// Тип для пропсов компонента Form
interface FormProps {
    formConfig: FormConfig;
}

// Компонент Form с типизацией пропсов
export default function Form({ formConfig }: FormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <form onSubmit={handleSubmit(formConfig.onSubmit)} className="space-y-4">
            {formConfig.fields.map((field) => (
                <div key={field.name}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    <input
                        id={field.name}
                        type={field.type}
                        {...register(field.name, field.validation)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors[field.name] && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors[field.name]?.message}
                        </p>
                    )}
                </div>
            ))}
            <div className="flex justify-center">
                <Button text="Отправить" type="submit" />
            </div>
        </form>
    );
};
