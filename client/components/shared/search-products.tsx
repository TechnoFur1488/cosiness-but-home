"use client"

import { useLazyGetProductsSearchQuery } from "@/store/apiSlice"
import { useCallback, useEffect, useRef, useState } from "react"
import { ProductLoading } from "../status/product-loading"
import Link from "next/link"
import Image from 'next/image'
import { RatingProductsStars } from "./rating-products-stars"
import { FavoriteProduct } from "./favorite-product"
import { DeleteProductBtn } from "./delete-product-btn"
import { AddCart } from "./add-cart"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"


export const SearchProducts = () => {
    const [triger, { data, isLoading, isError, isFetching }] = useLazyGetProductsSearchQuery()
    const searchParams = useSearchParams()
    const currentQuerySearch = searchParams.get("query") || ""
    const [currentOffset, setCurrentOffset] = useState(0)
    const observerTarget = useRef<HTMLDivElement>(null)

    useEffect(() => {
        triger({ offset: 0, query: currentQuerySearch }, true)
    }, [triger, currentQuerySearch])

    const loadMore = useCallback(() => {
        if (!isFetching && data?.hasMore) {
            setCurrentOffset(data.nextOffset)
            triger({
                offset: data.nextOffset,
                query: currentQuerySearch
            })
        }
    }, [isFetching, data, triger, currentQuerySearch])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            {
                threshold: 0.1,
                rootMargin: "100px"
            }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [loadMore])

    if (isLoading && !data) return <ProductLoading />
    if (isError) return <h1>Ошибка при загрузке товаров</h1>
    if (!data?.products.length) return <div className={"text-center bg-white rounded-2xl shadow space-y-2 p-3"}>
        <h1>Нет товаров</h1>
    </div>

    return (
        <>
            <h1 className={"text-2xl sm:text-3xl md:text-[32px] font-bold pb-2 sm:pb-3 md:pb-4"}>Товаров найдено: {data.total}</h1>
            <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-2"}>
                {data.products.map((el, i) => {
                    return (
                        <div key={`${el.id}-${i}`} className={"bg-white p-2 rounded-2xl shadow sm:h-114 h-85 flex justify-between flex-col relative"}>
                            <Link href={`/product/${el.id}`}>
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
                            <FavoriteProduct isId={el.id} />
                            <DeleteProductBtn isId={el.id} />
                            <div className={"w-full"}>
                                <AddCart isPrice={el.price} isSize={el.size} isId={el.id} />
                            </div>
                        </div>
                    )
                })}
            </div>
            <div
                ref={observerTarget}
                className="h-10"
                style={{ visibility: data?.hasMore ? 'visible' : 'hidden' }}
            />
            {isFetching && (
                <ProductLoading />
            )}
        </>
    )
}