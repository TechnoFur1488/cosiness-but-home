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
            <div className={"space-y-5 mb-20"}>
                <div className={"w-full h-[500px] relative"}>
                    <Image
                        src="/Group 70.png"
                        fill
                        priority
                        className="object-cover rounded-2xl"
                        sizes="100vw"
                        alt="картинка"
                    />
                    <div className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white flex flex-col items-center gap-4"}>
                        <h1 className={"text-5xl font-extrabold"}>Украсьте свое пространство уютными коврами</h1>
                        <span>Откройте для себя нашу тщательно отобранную коллекцию ковров премиум-класса, призванных привнести тепло и стиль в ваш дом.</span>
                        <Link className={"w-[140px] h-12 font-bold bg-black flex justify-center items-center rounded-2xl"} href={"/shop"}>Купить сейчас</Link>
                    </div>
                </div>
                <h3 className={"text-[22px] font-bold"}>Новинки</h3>
                <div className={"flex justify-between items-center"}>
                    <MainPageNewProducts />
                </div>
                <h3 className={"text-[22px] font-bold"}>Выберите что вам нужно</h3>
                <div className={"flex justify-between items-center"}>
                    <MainPageCatalog />
                </div>
                <div className={"w-full text-end"}>
                    <Link href={"/catalog"}>Показать ещё</Link>
                </div>
                <div className=" bg-white rounded-2xl shadow p-8">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl font-bold">Индивидуальный подход к каждому проекту</h2>
                        <p className=" text-lg">
                            Мы предлагаем уникальную услугу по созданию ковров любой формы и размера
                        </p>
                        <div className="grid grid-cols-3 gap-8 mt-10">
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Inbox width={32} height={32} />
                                </div>
                                <h3 className="font-semibold text-lg">Любая форма</h3>
                                <p>Создаем ковры любой геометрической формы: круг, овал, многоугольник</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Puzzle width={32} height={32} />
                                </div>
                                <h3 className="font-semibold text-lg">Точные размеры</h3>
                                <p>Вырезаем ковры под ваши точные измерения с погрешностью до 1 см</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <Sparkle width={32} height={32} />
                                </div>
                                <h3 className="font-semibold text-lg">Идеальная обработка</h3>
                                <p>Профессиональная обработка краёв для долговечности изделия</p>
                            </div>
                        </div>
                        <div className="mt-10">
                            <h3 className={"text-2xl font-bold"}>Позвоните нам и закажите индивидуальный вырез</h3>
                            <Link href={"tel: +7 964 717 67-16"} className={"flex items-center justify-center mt-5"} ><Phone width={20} height={20} className={"mr-2"} /> +7 964 717 67-16</Link>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col items-center bg-white rounded-2xl shadow p-8"}>
                    <h2 className={"text-4xl font-extrabold pb-2"}>Найдите свой идеальный ковер</h2>
                    <span className={"text-[#141414] pb-8"}>Ознакомьтесь с нашей обширной коллекцией и преобразите свой дом уже сегодня.</span>
                    <Link className="w-[192px] h-14 font-bold bg-black flex justify-center items-center rounded-2xl text-white text-center" href={"/shop"}>Просмотреть все ковры</Link>
                </div>
            </div>

        </div>
    )
}