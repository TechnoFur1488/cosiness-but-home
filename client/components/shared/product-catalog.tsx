"use client"

import { useDeleteForeverMutation, useGetForeverQuery, useLazyGetProductsCatalogQuery, usePostForeverMutation } from '@/store/apiSlice'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProductImg } from './product-img'
import { Heart } from 'lucide-react'

interface Products {
    id: number
    img: Array<string>
    name: string
    price: number
    discount: number
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

    useEffect(() => {
        setAllProducts([])
    }, [catalogId])

    useEffect(() => {
        if (data?.products) {
            setAllProducts(prev => {
                const catalogProducts = data.products.filter(p => p.catalogId === catalogId)
                const existingIds = new Set(prev.map(p => p.id))
                const newProducts = catalogProducts.filter(p => !existingIds.has(p.id))
                return [...prev, ...newProducts]
            })
        }
    }, [data, catalogId])

    useEffect(() => {
        if (catalogId) {
            trigger({ catalogId, offset: 0 }, true)
        }
    }, [catalogId, trigger])

    useEffect(() => {
        if (!data?.hasMore || isFetching) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    trigger({ catalogId, offset: data.nextOffset })
                }
            },
            { threshold: 0.1 }
        )

        const currentLoader = loaderRef.current
        if (currentLoader) observer.observe(currentLoader)

        return () => {
            if (currentLoader) observer.unobserve(currentLoader)
        }
    }, [catalogId, data, isFetching, trigger])

    const productsWithKeys = useMemo(() => {
        return allProducts.map((product, i) => ({
            ...product,
            uniqueKey: `${product.id}-${i}`
        }))
    }, [allProducts])

    const favorite = useMemo(() => {
        return new Set(forever?.foreverItem?.map(i => i.product.id) || new Set())
    }, [forever])

    const handleFavoriteClick = async (productId: number) => {
        try {
            if (favorite.has(productId)) {
                await deleteForever(productId).unwrap()
            } else {
                await postForever(productId).unwrap()
            }
        } catch (err) {
            alert(favorite.has(productId) ? "Не смогли удалить из избранного" : "Не смогли добавить в избранное")
            console.error(err)
        }
    }

    if (isError) return <h1>Ошибка</h1>
    if (isLoading && allProducts.length === 0) return <h1>Загрузка</h1>

    return (
        <div className="grid grid-cols-4 gap-x-5 gap-y-10 my-20">
            {productsWithKeys.map((el) => (
                <div className="flex flex-col items-start justify-between relative" key={el.uniqueKey}>
                    <Link className="h-[550px] flex flex-col justify-between" href={`/product/${el.id}`}>
                        <ProductImg isImg={el.img} />
                        <span className="py-[13px]">{el.name}</span>
                        <div className="py-[9px]">
                            <span>
                                {el.price.toLocaleString("ru-RU", {
                                    style: "currency",
                                    currency: "RUB",
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0
                                })}
                            </span>
                            {el.discount > 0 && (
                                <span className="pl-3 line-through text-[#aaaaaa]">
                                    {el.discount.toLocaleString("ru-RU", {
                                        style: "currency",
                                        currency: "RUB",
                                        maximumFractionDigits: 0
                                    })}
                                </span>
                            )}
                        </div>
                    </Link>
                    <button onClick={() => { handleFavoriteClick(el.id) }} className={"p-2 absolute top-0 right-0 z-30 cursor-pointer"}>
                        <Heart
                            fill={favorite.has(el.id) ? 'red' : 'currentColor'}
                            color={favorite.has(el.id) ? 'red' : 'black'}
                            className={"text-[#E5E5EA]  "}
                        />
                    </button>
                    <button className="w-full bg-[#E5E5E5] rounded-2xl h-[46px] cursor-pointer hover:bg-[#DBDBDB] transition duration-150">
                        В корзину
                    </button>
                </div>
            ))}

            <div ref={loaderRef} className="h-20 flex items-center justify-center col-span-4">
                {isFetching && <span>Загрузка...</span>}
                {!data?.hasMore && <span className="text-gray-400">Товаров больше нет</span>}
            </div>
        </div>
    )
}