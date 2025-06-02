import { useGetNewProductQuery } from "@/store/apiSlice"
import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from 'swiper/modules'
import "swiper/css"
import { RatingProductsStars } from "./rating-products-stars"
import { AddCart } from "./add-cart"
import { MiniNewProductLoading } from "../status/mini-new-product-loading"

export const MainPageNewProducts = () => {
    const { data, isLoading, isError } = useGetNewProductQuery()

    if (isLoading) return <MiniNewProductLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <>
            {data?.products.map(el => (
                <div key={el.id} className={"bg-white p-2 rounded-2xl shadow h-114 flex justify-between flex-col"}>
                    <Link href={`/product/${el.id}`}>
                        <div className={"w-[225px] relative"}>
                            <Image src={el.img[0]} alt="Main product image" fill className={"object-cover rounded-2xl hover:opacity-0 relative z-20"} sizes="(max-width: 768px) 100vw, 345px" priority />
                            <Swiper className="w-full h-[300] rounded-2xl" spaceBetween={30} centeredSlides={true} loop={true} autoplay={{ delay: 2000, disableOnInteraction: false, }} modules={[Autoplay]}>
                                {el.img.map((elImg, i) => (
                                    <SwiperSlide key={i}>
                                        <div className={"w-[225px] h-[300px] relative"}>
                                            <Image className={"rounded-2xl object-cover"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill src={elImg} alt={elImg} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <div className={"flex justify-between flex-col mt-2 space-y-2"}>
                            <span>{el.name}</span>
                            <div className={"text-[#737373]"}>
                                <span>{el.price.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                <span className={"pl-3 line-through"}>{el.discount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            </div>
                            <RatingProductsStars isId={el.id} />
                        </div>
                    </Link>
                    <div className={"w-full"}>
                        <AddCart isPrice={el.price} isSize={el.size} isId={el.id} />
                    </div>
                </div>
            ))}
        </>
    )
}