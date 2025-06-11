"use client"

import Image from "next/image"
import Link from "next/link"
import "swiper/css"
import { Inbox, Phone, Puzzle, Sparkle } from "lucide-react"
import { MainPageNewProducts } from "./main-page-new-products"
import { MainPageCatalog } from "./main-page-catalog"

export const MainPage = () => {

    return (
        <div>
            <div className={"space-y-8 sm:space-y-12 mb-10 sm:mb-20"}>
                <div className={"w-full h-[300px] sm:h-[400px] md:h-[500px] relative"}>
                    <Image
                        src="/Group 70.png"
                        fill
                        priority
                        className="object-cover rounded-2xl"
                        sizes="100vw"
                        alt="картинка"
                    />
                    <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white flex flex-col items-center gap-3 sm:gap-4 w-[280px] sm:w-[600px] md:w-[700px]"}>
                        <h1 className={"text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight"}>Украсьте свое пространство уютными коврами</h1>
                        <span className={"text-sm sm:text-base md:text-lg"}>Откройте для себя нашу тщательно отобранную коллекцию ковров премиум-класса, призванных привнести тепло и стиль в ваш дом.</span>
                        <Link className={"w-[140px] h-12 text-sm sm:text-base font-bold bg-black hover:bg-gray-900 transition-colors flex justify-center items-center rounded-2xl"} href={"/shop"}>Купить сейчас</Link>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <h3 className={"text-xl sm:text-2xl md:text-3xl font-bold"}>Новинки</h3>
                    <MainPageNewProducts />
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <h3 className={"text-xl sm:text-2xl md:text-3xl font-bold"}>Выберите что вам нужно</h3>
                    <MainPageCatalog />
                    <div className={"w-full text-end"}>
                        <Link href={"/catalog"} className="text-sm sm:text-base hover:text-gray-600 transition-colors">Показать ещё</Link>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-4 sm:p-6 md:p-8">
                    <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Индивидуальный подход к каждому проекту</h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600">
                            Мы предлагаем уникальную услугу по созданию ковров любой формы и размера
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-10">
                            <div className="space-y-3 text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Inbox className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg">Любая форма</h3>
                                <p className="text-sm sm:text-base text-gray-600">Создаем ковры любой геометрической формы: круг, овал, многоугольник</p>
                            </div>
                            <div className="space-y-3 text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Puzzle className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg">Точные размеры</h3>
                                <p className="text-sm sm:text-base text-gray-600">Вырезаем ковры под ваши точные измерения с погрешностью до 1 см</p>
                            </div>
                            <div className="space-y-3 text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Sparkle className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg">Идеальная обработка</h3>
                                <p className="text-sm sm:text-base text-gray-600">Профессиональная обработка краёв для долговечности изделия</p>
                            </div>
                        </div>
                        <div className="mt-8 sm:mt-10">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">Позвоните нам и закажите индивидуальный вырез</h3>
                            <Link href={"tel: +7 964 717 67-16"} className="flex items-center justify-center mt-4 text-base sm:text-lg hover:text-gray-600 transition-colors">
                                <Phone className="w-5 h-5 mr-2" /> +7 964 717 67-16
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-white rounded-2xl shadow p-4 sm:p-6 md:p-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold pb-2">Найдите свой идеальный ковер</h2>
                    <span className="text-sm sm:text-base md:text-lg text-gray-800 pb-6 sm:pb-8">
                        Ознакомьтесь с нашей обширной коллекцией и преобразите свой дом уже сегодня.
                    </span>
                    <Link
                        className="w-[180px] sm:w-[192px] h-12 sm:h-14 font-bold bg-black hover:bg-gray-900 transition-colors flex justify-center items-center rounded-2xl text-white text-sm sm:text-base"
                        href={"/shop"}
                    >
                        Просмотреть все ковры
                    </Link>
                </div>
            </div>
        </div>
    )
}