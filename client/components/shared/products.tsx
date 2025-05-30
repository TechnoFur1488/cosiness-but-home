"use client"

import { useGetForeverQuery, useLazyGetProductsQuery } from '@/store/apiSlice'
import { useEffect, useRef, useState, useMemo } from 'react'
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
    const [allProducts, setAllProducts] = useState<Products[]>(initialData.products)
    const loaderRef = useRef<HTMLDivElement>(null)
    const { data: forever } = useGetForeverQuery()
    const [page, setPage] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const [currentData, setCurrentData] = useState<ProductsResponse>(initialData)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (data?.products) {
            setAllProducts(prev => {
                const newProducts = data.products.filter(
                    newProduct => !prev.some(product => product.id === newProduct.id)
                )
                return [...prev, ...newProducts]
            })
            setCurrentData(data)
        }
    }, [data])

    useEffect(() => {
        if (!isMounted) return

        const observer = new IntersectionObserver(
            entries => {
                const firstEntry = entries[0]
                if (firstEntry.isIntersecting && !isFetching && currentData?.hasMore) {
                    const nextPage = page + 1
                    setPage(nextPage)
                    trigger(currentData.nextOffset)
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
    }, [currentData, isFetching, page, isMounted])

    const productsWithKeys = useMemo(() => {
        return allProducts.map((product, index) => ({
            ...product,
            uniqueKey: `${product.id}-${index}`
        }))
    }, [allProducts])

    const favorite = useMemo(() => {
        return new Set(forever?.foreverItem?.map(i => i.product.id) || new Set())
    }, [forever])

    if (!isMounted) {
        return null
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center py-10 text-red-500">Ошибка загрузки товаров</div>
            </div>
        )
    }

    if (isLoading && allProducts.length === 0) {
        return (
            <ProductLoading />
        )
    }

    return (
        <>
            <div className={"mb-3"}>
                <h1 className={"text-[32px] font-bold pb-3"}>Весь ассортимент</h1>
                <span className={"text-[#737373]"}>Познакомьтесь с нашей тщательно отобранной коллекцией ковров премиум-класса, призванных придать вашему жилому дому пространству комфорт и стиль</span>
            </div>
            <div className={"grid grid-cols-5 gap-x-5 gap-y-46"}>
                {productsWithKeys.map((el) => {
                    return (
                        <div className={"flex flex-col items-start justify-between relative h-72.5"} key={el.uniqueKey}>
                            <Link className={"flex flex-col justify-between"} href={`/product/${el.id}`}>
                                <ProductImg isImg={el.img} />
                                <div className={"h-24 my-3 flex justify-between flex-col"}>
                                    <span>{el.name}</span>
                                    <div className={"text-[#737373]"}>
                                        <span>
                                            {el.price.toLocaleString("ru-RU", {
                                                style: "currency",
                                                currency: "RUB",
                                                maximumFractionDigits: 0,
                                                minimumFractionDigits: 0
                                            })}
                                        </span>
                                        {el.discount > 0 && (
                                            <span className="pl-3 line-through">
                                                {el.discount.toLocaleString("ru-RU", {
                                                    style: "currency",
                                                    currency: "RUB",
                                                    maximumFractionDigits: 0
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <RatingProducts isId={el.id} />
                                </div>
                            </Link>
                            <FavoriteProduct
                                isId={el.id}
                                isFavorite={favorite}
                            />
                            <DeleteProductBtn isId={el.id} />
                            <div className="w-full">
                                <AddCart isPrice={el.price} isSize={el.size} isId={el.id} />
                            </div>
                        </div>
                    )
                })}
            </div>
            <div ref={loaderRef} className='mb-20'>
                {isFetching && (
                    <ProductLoading />
                )}
                {!currentData?.hasMore && <span className="text-gray-400 flex justify-center mt-15">Товаров больше нет</span>}
            </div>
        </>
    )
}