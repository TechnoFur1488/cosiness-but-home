import { useGetNewProductQuery } from "@/store/apiSlice"
import Link from "next/link"
import Image from "next/image"
import "swiper/css"
import { RatingProductsStars } from "./rating-products-stars"
import { AddCart } from "./add-cart"
import { MiniNewProductLoading } from "../status/mini-new-product-loading"
import { cn } from "@/lib/utils"

export const MainPageNewProducts = () => {
    const { data, isLoading, isError } = useGetNewProductQuery()

    if (isLoading) return <MiniNewProductLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-2 gap-y-2"}>
            {data?.products.map(el => (
                <div key={el.id} className={"bg-white p-2 rounded-2xl shadow flex flex-col justify-between"}>
                    <Link href={`/product/${el.id}`} className="block">
                        <div className={"sm:h-75 h-45 relative"}>
                            <Image src={el.img[0]} alt="Main product image" fill className={"object-cover rounded-2xl"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
                        </div>
                        <div className={"flex justify-between flex-col mt-2 space-y-2 sm:text-[16px] text-[14px]"}>
                            <span>{el.name.length > 20 ? `${el.name.slice(0, 20)}...` : el.name}</span>
                            <div className={"text-[#737373]"}>
                                <span>{el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                <span className={cn("pl-3 line-through", el.discount === 0 && "hidden")}>{el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            </div>
                            <RatingProductsStars isId={el.id} />
                        </div>
                    </Link>
                    <div className={"w-full mt-2 sm:mt-3"}>
                        <AddCart isPrice={el.price} isSize={el.size} isId={el.id} />
                    </div>
                </div>
            ))}
        </div>
    )
}