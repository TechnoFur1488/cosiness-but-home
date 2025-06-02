"use client"

import { useDeleteForeverMutation, useGetForeverQuery, useLazyGetProductsCatalogQuery, usePostForeverMutation } from '@/store/apiSlice'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { RatingProductsStars } from './rating-products-stars'
import { AddCart } from './add-cart'
import { DeleteProductBtn } from './delete-product-btn'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import { Autoplay } from 'swiper/modules'
import { FavoriteProduct } from './favorite-product'

interface Products {
    id: number,
    img: string[],
    name: string,
    price: number,
    discount: number,
    size: string[]
    catalogId: number
}

export const ProductCatalog = () => {
    const router = useParams()
    const catalogId = Number(router.catalogId)
    const [trigger, { data, isLoading, isError, isFetching }] = useLazyGetProductsCatalogQuery()
    const [allProducts, setAllProducts] = useState<Products[]>([])
    const loaderRef = useRef<HTMLDivElement>(null)
    const [postForever] = usePostForeverMutation()
    const [deleteForever] = useDeleteForeverMutation()
    const { data: forever } = useGetForeverQuery()
    const [page, setPage] = useState(0)

    useEffect(() => {
        if (catalogId) {
            setAllProducts([])
            setPage(0)
            trigger({ catalogId, offset: 0 })
        }
    }, [catalogId, trigger])

    useEffect(() => {
        if (data?.products) {
            setAllProducts(prev => {
                const currentCatalogProducts = data.products.filter(p => p.catalogId === catalogId)
                const existingIds = new Set(prev.map(p => p.id))
                const newProducts = currentCatalogProducts.filter(p => !existingIds.has(p.id))
                return [...prev, ...newProducts]
            })
        }
    }, [data, catalogId])

    useEffect(() => {
        if (!data?.hasMore || isFetching) return

        const observer = new IntersectionObserver(
            entries => {
                const firstEntry = entries[0]
                if (firstEntry.isIntersecting && !isFetching && data?.hasMore) {
                    const nextPage = page + 1
                    setPage(nextPage)
                    trigger({ catalogId, offset: data.nextOffset })
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px'
            }
        )

        const currentLoader = loaderRef.current
        if (currentLoader) {
            observer.observe(currentLoader)
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader)
            }
        }
    }, [data, isFetching, page, catalogId])

    const productsWithKeys = useMemo(() => {
        return allProducts
            .filter(product => product.catalogId === catalogId)
            .map((product, i) => ({
                ...product,
                uniqueKey: `${product.id}-${i}`
            }))
    }, [allProducts, catalogId])

    const favorite = useMemo(() => {
        return new Set(forever?.foreverItem?.map(i => i.product.id) || new Set())
    }, [forever])

    if (isError) return <div className="text-center py-10">Ошибка загрузки</div>
    if (isLoading && allProducts.length === 0) return <div className="text-center py-10">Загрузка...</div>

    return (
        <div className="grid grid-cols-5 gap-x-5 gap-y-5 my-20">
            {productsWithKeys.map((el) => (
                <div key={el.id} className={"bg-white p-2 rounded-2xl shadow h-114 flex justify-between flex-col relative"}>
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
            ))}

            <div ref={loaderRef} className="h-20 flex items-center justify-center col-span-4">
                {isFetching && <span>Загрузка...</span>}
                {!data?.hasMore && allProducts.length > 0 && (
                    <span className="text-gray-400">Товаров больше нет</span>
                )}
            </div>
        </div>
    )
}