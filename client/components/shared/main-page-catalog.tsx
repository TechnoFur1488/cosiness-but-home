import { useGetCatalogQuery } from "@/store/apiSlice"
import Link from "next/link"
import Image from "next/image"
import { MiniCatalogLoading } from "../status/mini-catalog-loading"

export const MainPageCatalog = () => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <MiniCatalogLoading />
    if (isError) return <p>Error</p>

    return (
        <div className={"grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-3 lg:grid-cols-4"}>
            {data?.catalogs.slice(0, 4).map(el => (
                <div key={el.id} className={"relative w-full shadow bg-white h-full rounded-2xl"}>
                    <Link 
                        className="block font-medium p-2 sm:p-3" 
                        href={`/catalog-products/${el.id}`}
                    >
                        <div className="relative w-full aspect-square mb-2">
                            <Image
                                src={el.img[0]}
                                alt={el.name}
                                fill
                                className="object-cover rounded-xl"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                priority
                            />
                        </div>
                        <span className={"block text-sm sm:text-base line-clamp-2"}>{el.name}</span>
                    </Link>
                </div>
            ))}
        </div>
    )
}