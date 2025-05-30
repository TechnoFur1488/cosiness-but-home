"use client"

import { useGetCatalogQuery } from "@/store/apiSlice"
import Image from "next/image"
import Link from "next/link"

export const MainPage = () => {

    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error</p>

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
                <h3 className={"text-[22px] font-bold"}>Популярные ковры</h3>
                <h3 className={"text-[22px] font-bold"}>Выберите что вам нужно</h3>
                <div className={"flex justify-between items-center"}>
                    {data?.catalogs.slice(0, 4).map(el => (
                        <div key={el.id} className={"relative w-[223px] h-[250px] flex flex-col"}>
                            <Link className="font-medium hover:text-gray-600 transition-colors" href={`/catalog-products/${el.id}`}>
                                <div className="relative w-full h-[200px] mb-3">
                                    <Image
                                        src={el.img[0]}
                                        alt="Product image"
                                        fill
                                        className="object-cover rounded-xl"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <span>{el.name}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <div className={"flex flex-col items-center"}>
                <h2 className={"text-4xl font-extrabold pb-2"}>Найдите свой идеальный ковер</h2>
                <span className={"text-[#141414] pb-8"}>Ознакомьтесь с нашей обширной коллекцией и преобразите свой дом уже сегодня.</span>
                <Link className="w-[192px] h-14 font-bold bg-black flex justify-center items-center rounded-2xl text-white text-center" href={"/shop"}>Просмотреть все ковры</Link>
            </div>
        </div>
    )
}