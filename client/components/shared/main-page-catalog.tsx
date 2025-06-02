import { useGetCatalogQuery } from "@/store/apiSlice"
import Link from "next/link"
import Image from "next/image"
import { MiniCatalogLoading } from "../status/mini-catalog-loading"

export const MainPageCatalog = () => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <MiniCatalogLoading />
    if (isError) return <p>Error</p>

    return (
        <>
            {data?.catalogs.slice(0, 4).map(el => (
                <div key={el.id} className={"relative w-[223px] h-[250px] flex flex-col"}>
                    <Link className="font-medium hover:text-gray-600 transition-colors bg-white p-2 rounded-2xl shadow" href={`/catalog-products/${el.id}`}>
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
        </>
    )
}