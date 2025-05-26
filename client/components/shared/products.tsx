"use client"

import { useDeleteForeverMutation, useGetForeverQuery, useLazyGetProductsQuery, usePostForeverMutation } from '@/store/apiSlice'
import React, { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { ProductImg } from './product-img'
import { AddCart } from './add-cart'
import { DeleteProductBtn } from './delete-product-btn'
import { RatingProducts } from './rating-products'
import { FavoriteProduct } from './favorite-product'
import { ProductLoading } from '../status/product-loading'

interface Products {
    id: number
    img: string[]
    name: string
    price: number
    discount: number
    size: string[]
}

export const Products = () => {
    const [trigger, { data, isLoading, isError, isFetching }] = useLazyGetProductsQuery()
    const [allProducts, setAllProducts] = useState<Products[]>([])
    const loaderRef = useRef<HTMLDivElement>(null)
    const { data: forever } = useGetForeverQuery()
    const [loadingImg, setLoadingImg] = useState(false)
    const [page, setPage] = useState(0)

    useEffect(() => {
        trigger(0)
    }, [])

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
        const observer = new IntersectionObserver(
            entries => {
                const firstEntry = entries[0]
                if (firstEntry.isIntersecting && !isFetching && data?.hasMore) {
                    const nextPage = page + 1
                    setPage(nextPage)
                    trigger(data.nextOffset)
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
    }, [data, isFetching, page])

    const productsWithKeys = useMemo(() => {
        return allProducts.map((product, index) => ({
            ...product,
            uniqueKey: `${product.id}-${index}`
        }))
    }, [allProducts])

    const favorite = useMemo(() => {
        return new Set(forever?.foreverItem?.map(i => i.product.id) || new Set())
    }, [forever])

    if (isError) return <div className="text-center py-10">Ошибка загрузки</div>
    if (isLoading && allProducts.length === 0) return <ProductLoading />

    return (
        <>
            <div className={"grid grid-cols-4 gap-x-5 gap-y-10 mt-20"}>
                {productsWithKeys.map((el) => {
                    return (
                        <div className={"flex flex-col items-start justify-between relative"} key={el.uniqueKey}>
                            <Link className={"h-[550px] flex flex-col justify-between"} href={`/product/${el.id}`}>
                                <ProductImg isImg={el.img} />
                                <span className={"py-[13px]"}>{el.name}</span>
                                <RatingProducts isId={el.id} />
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
                                </div>
                            </Link>
                            <FavoriteProduct
                                isId={el.id}
                                isFavorite={favorite}
                            />
                            <DeleteProductBtn isId={el.id} />
                            <AddCart isPrice={el.price} isSize={el.size} isId={el.id} />
                        </div>
                    )
                })}

            </div>
            <div ref={loaderRef} className='mb-20'>
                {isFetching && <ProductLoading />}
                {!data?.hasMore && <span className="text-gray-400 flex justify-center mt-15">Товаров больше нет</span>}
            </div>
        </>
    )
}