"use client"

import { useGetCatalogQuery } from "@/store/apiSlice"
import Image from "next/image"
import Link from "next/link"

export const Catalog = () => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>

    return (
        <div>
            <h1 className={"font-bold text-[32px]"}>Каталог</h1>
            <div className={"grid grid-cols-4 gap-x-5 gap-y-7"}>
                {data?.catalogs.map(el => (
                    <Link key={el.id} href={`/catalog-products/${el.id}`}>
                        <div className={"relative w-full h-[200px] mb-3"} >
                            <Image src={el.img[0]} alt={"Product image"} fill className="object-cover rounded-xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                        <span>{el.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}