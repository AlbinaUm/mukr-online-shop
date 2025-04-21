// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        // добавьте другие пути если необходимо
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1D4ED8', // Ваш основной цвет
                secondary: '#2563EB', // Дополнительный цвет
            },
        },
    },
    plugins: [],
};

export default config;
