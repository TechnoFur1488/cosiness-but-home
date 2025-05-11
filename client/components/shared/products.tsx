"use client"

import { useDeleteForeverMutation, useGetForeverQuery, useGetRatingQuery, useLazyGetProductsQuery, usePostForeverMutation } from '@/store/apiSlice'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { ProductImg } from './product-img'
import { useParams } from 'next/navigation'
import { AddCart } from './add-cart'
import { Heart } from 'lucide-react'
import { DeleteProductBtn } from './delete-product-btn'

interface Props {
    className?: string
}

interface Products {
    id: number
    img: Array<string>
    name: string
    price: number
    discount: number
    size: Array<string>
}

export const Products: React.FC<Props> = () => {
    const router = useParams()
    const productId = router.productId
    const [trigger, { data, isLoading, isError, isFetching }] = useLazyGetProductsQuery()
    const [allProducts, setAllProducts] = useState<Products[]>([])
    const loaderRef = useRef<HTMLDivElement>(null)
    // const { data: rating } = useGetRatingQuery(Number(productId))
    const [postForever] = usePostForeverMutation()
    const [deleteForever] = useDeleteForeverMutation()
    const { data: forever } = useGetForeverQuery()

    useEffect(() => {
        if (data?.products) {
            setAllProducts(prev => {
                const newProducts = data.products.filter(
                    newProduct => !prev.some(product => product.id === newProduct.id)
                )
                return [...prev, ...newProducts]
            })
        }
    }, [data])

    useEffect(() => {
        trigger(0)
    }, [trigger])

    useEffect(() => {
        if (!data?.hasMore || isFetching) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    trigger(data.nextOffset)
                }
            },
            { threshold: 0.1 }
        )

        if (loaderRef.current) observer.observe(loaderRef.current)

        return () => observer.disconnect()
    }, [data, isFetching, trigger])

    const productsWithKeys = useMemo(() => {
        return allProducts.map((product, index) => ({
            ...product,
            uniqueKey: `${product.id}-${index}`
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

    if (isError) return <div className="text-center py-10">Ошибка загрузки</div>
    if (isLoading && allProducts.length === 0) return <div className="text-center py-10">Загрузка...</div>

    return (
        <div className={"grid grid-cols-4 gap-x-5 gap-y-10 my-20"}>
            {productsWithKeys.map((el) => (
                <div className={"flex flex-col items-start justify-between relative"} key={el.uniqueKey}>
                    <Link className={"h-[550px] flex flex-col justify-between"} href={`/product/${el.id}`}>
                        <ProductImg isImg={el.img} />
                        <span className={"py-[13px]"}>{el.name}</span>
                        <div className={"py-[9px]"}>
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
                            {/* {averageRating ? <span>Средний рейтинг: {averageRating.toFixed(1)}</span> : <span>Отзывов пока что нет</span>} */}
                        </div>
                    </Link>
                    <button  onClick={() => { handleFavoriteClick(el.id) }} className={"p-2 absolute top-0 right-0 z-30 cursor-pointer"}>
                        <Heart
                            fill={favorite.has(el.id) ? 'red' : 'currentColor'}
                            color={favorite.has(el.id) ? 'red' : 'black'}
                            className={"text-[#E5E5EA]  "}
                        />
                    </button>
                    <DeleteProductBtn isId={el.id} />
                    <AddCart isPrice={el.price} isSize={el.size} isId={el.id} />
                </div>
            ))}

            <div ref={loaderRef} className="h-20 flex items-center justify-center col-span-4">
                {isFetching && <span>Загрузка...</span>}
                {!data?.hasMore && <span className="text-gray-400">Товаров больше нет</span>}
            </div>
        </div>
    )
}