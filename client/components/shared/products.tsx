"use client"

import { useLazyGetProductsQuery } from '@/store/apiSlice'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { AddCart } from './add-cart'
import { DeleteProductBtn } from './delete-product-btn'
import { RatingProductsStars } from './rating-products-stars'
import { FavoriteProduct } from './favorite-product'
import { ProductLoading } from '../status/product-loading'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import { Autoplay } from 'swiper/modules'

interface Products {
    id: number
    img: string[]
    name: string
    price: number
    discount: number
    size: string[]
}

interface ProductsResponse {
    products: Products[]
    hasMore: boolean
    nextOffset: number
}

interface ProductsProps {
    initialData: ProductsResponse
}

export const Products = ({ initialData }: ProductsProps) => {

    const [trigger, { data, isLoading, isError, isFetching }] = useLazyGetProductsQuery()
    const [currentOffset, setCurrentOffset] = useState(0)
    const observerTarget = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (initialData) {
            trigger({ offset: 0 }, true)
        } else {
            trigger({ offset: 0 })
        }
    }, [trigger, initialData])

    const loadMore = useCallback(() => {
        if (!isFetching && data?.hasMore) {
            setCurrentOffset(data.nextOffset)
            trigger({
                offset: data.nextOffset
            })
        }
    }, [isLoading, data, trigger])

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

    const displayData = data || initialData

    if (isLoading && !data) return <ProductLoading />
    if (isError) return <h1>Ошибка при загрузке отзывов</h1>
    if (!data?.products.length) return <h1 className={"text-center"}>Нет товаров</h1>

    return (
        <>
            <div className={"grid grid-cols-5 gap-x-5 gap-y-5"}>
                {displayData.products.map((el, i) => {
                    return (
                        <div key={`${el.id}-${i}`} className={"bg-white p-2 rounded-2xl shadow h-114 flex justify-between flex-col relative"}>
                            <Link href={`/product/${el.id}`}>
                                <div className={"w-full relative"}>
                                    <Image src={el.img[0]} alt="Main product image" fill className={"object-cover rounded-2xl hover:opacity-0 relative z-20"} sizes="(max-width: 768px) 100vw, 345px" priority />
                                    <Swiper className="w-full h-[300] rounded-2xl" spaceBetween={30} centeredSlides={true} loop={true} autoplay={{ delay: 2000, disableOnInteraction: false, }} modules={[Autoplay]}>
                                        {el.img.map((elImg, i) => (
                                            <SwiperSlide key={i}>
                                                <div className={"w-full h-[300px] relative"}>
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