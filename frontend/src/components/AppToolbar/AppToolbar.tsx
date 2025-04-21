import Link from "next/link";

export default function AppToolbar() {
    return (
        <div className="bg-gray-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-semibold">
                        <span className="text-primary">MyShop</span> {/* Используем кастомный цвет */}
                    </Link>

                    <div className="hidden lg:flex space-x-4">
                        <Link href="/"   className="bg-primary hover:bg-secondary text-white pl-2 py-2 rounded-md">
                            Главная
                        </Link>
                        <Link
                            href="/login"
                            className="bg-primary hover:bg-secondary text-white pl-5 py-2 rounded-md"
                        >
                            Войти
                        </Link>
                        <span  className="bg-primary hover:bg-secondary text-white py-2 rounded-md">|</span>
                        <Link
                            href="/register"
                            className="bg-primary hover:bg-secondary text-white  py-2 rounded-md"
                        >
                            Регистрация
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
