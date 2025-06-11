"use client"

import { useDeleteCatalogMutation, useGetCatalogQuery } from "@/store/apiSlice"
import Image from "next/image"
import Link from "next/link"
import { CatalogLoading } from "../status/catalog-loading"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { Trash2 } from "lucide-react"
import { CatalogUpdate } from "./catalog-update"

export const Catalog = () => {
    const { data, isLoading, isError } = useGetCatalogQuery()
    const [deleteCatalog] = useDeleteCatalogMutation()
    const role = useTokenDecryptor()

    const handleClickDeleteCatalog = async (id: number) => {
        try {
            await deleteCatalog(id).unwrap()
        } catch (err) {
            alert("Не смогли удалить каталог")
            console.error(err)
        }
    }

    if (isLoading) return <CatalogLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <div className={"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"}>
            {data?.catalogs.map((el: any) => (
                <div key={el.id} className={"group relative bg-white p-2 sm:p-3 rounded-2xl shadow-sm"}>
                    {role === "ADMIN" && (
                        <div className="absolute top-2 right-2 left-2 flex justify-between z-10">
                            <CatalogUpdate isId={el.id} isName={el.name} isImg={el.img} />
                            <button 
                                onClick={() => handleClickDeleteCatalog(el.id)}
                                className="hover:scale-110 transition-transform duration-300"
                            >
                                <Trash2 fill='white' className='hover:text-red-600 transition-colors' width={20} />
                            </button>
                        </div>
                    )}
                    <Link href={`/catalog-products/${el.id}`} className="block">
                        <div className="relative w-full mb-2 sm:mb-3" style={{ aspectRatio: '4/4' }}>
                            <Image 
                                src={el.img[0]} 
                                alt={el.name} 
                                fill 
                                className="object-cover rounded-xl" 
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" 
                                priority
                            />
                        </div>
                        <span className="block text-sm sm:text-base font-medium text-gray-800">
                            {el.name}
                        </span>
                    </Link>
                </div>
            ))}
        </div>
    )
}