"use client"

import { useLazyGetProductsQuery } from '@/store/apiSlice'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { ProductImg } from './product-img'

interface Props {
    className?: string
}

interface Products {
    id: number
    img: Array<string>
    name: string
    price: number
    discount: number
}

export const Products: React.FC<Props> = () => {
    const [trigger, { data, isLoading, isError, isFetching }] = useLazyGetProductsQuery()
    const [allProducts, setAllProducts] = useState<Products[]>([])
    const loaderRef = useRef<HTMLDivElement>(null)

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

    if (isError) return <div className="text-center py-10">Ошибка загрузки</div>
    if (isLoading && allProducts.length === 0) return <div className="text-center py-10">Загрузка...</div>

    return (
        <div className="grid grid-cols-4 gap-x-5 gap-y-10 my-20">
            {productsWithKeys.map((el) => (
                <div className="flex flex-col items-start justify-between" key={el.uniqueKey}>
                    <Link className="h-[437px] flex flex-col justify-between" href={`/product/${el.id}`}>
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