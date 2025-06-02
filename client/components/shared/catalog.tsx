"use client"

import { useGetCatalogQuery } from "@/store/apiSlice"
import Image from "next/image"
import Link from "next/link"
import { CatalogLoading } from "../status/catalog-loading"

export const Catalog = () => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <CatalogLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <div className={"grid grid-cols-4 gap-x-5 gap-y-7"}>
            {data?.catalogs.map(el => (
                <Link className={"bg-white p-2 rounded-2xl shadow font-medium hover:text-gray-600 transition-colors"} key={el.id} href={`/catalog-products/${el.id}`}>
                    <div className={"relative w-full h-[200px] mb-3"} >
                        <Image src={el.img[0]} alt={"Product image"} fill className="object-cover rounded-xl" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    </div>
                    <span>{el.name}</span>
                </Link>
            ))}
        </div>
    )
}