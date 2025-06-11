"use client"

import { useDeleteForeverMutation, useGetForeverQuery } from '@/store/apiSlice'
import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { AddCart } from './add-cart'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HiddenScrol } from '../utils'
import { FavoriteLoading } from '../status/favorite-loading'

interface Props {
    className?: string
}

interface Forever {
    id: number
    product: {
        id: number
        img: Array<string>
        name: string
        price: number
        discount: number
        compound: string
        warp: string
        hight: number
        hardness: number
        size: Array<string>
        description: string
        catalogId: number
    }
}

export const Favorite = ({ className }: Props) => {
    const [scroll, setScroll] = useState(false)
    const { data, isLoading, isError } = useGetForeverQuery()
    const [deleteForever] = useDeleteForeverMutation()

    const handleClickDeleteForever = async (productId: number) => {
        try {
            await deleteForever(productId).unwrap()
        } catch (err) {
            alert("Не смогли удалить избранное")
            console.error(err)
        }
    }

    HiddenScrol(scroll)

    if (isLoading) return <FavoriteLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <div className={cn("space-y-5", className)}>
            {data?.foreverItem?.map((el: Forever) => {

                const product = el.product

                return (
                    <div key={el.id} className="sm:flex sm:items-center sm:justify-between relative group bg-white p-2 rounded-2xl shadow space-y-3 sm:sm-y-0">
                        <Link className={"flex items-center flex-1"} href={`/product/${product.id}`}>
                            <div className={"relative w-[120px] h-[80px] min-w-[120px]"}>
                                <Image
                                    className="object-cover rounded-md"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    src={product.img[0]}
                                    alt="Product image"
                                />
                            </div>
                            <div className="ml-4 flex flex-col">
                                <span className="text-lg">{product.name}</span>
                                <div className="mt-2">
                                    <span className="font-medium">
                                        {product.price.toLocaleString("ru-RU", {
                                            style: "currency",
                                            currency: "RUB",
                                            maximumFractionDigits: 0,
                                            minimumFractionDigits: 0
                                        })}
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="pl-3 line-through text-[#aaaaaa]">
                                            {product.discount.toLocaleString("ru-RU", {
                                                style: "currency",
                                                currency: "RUB",
                                                maximumFractionDigits: 0
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                        <div className={"flex items-center space-x-3"}>
                            <button
                                onClick={() => handleClickDeleteForever(product.id)}
                                className={'p-2 rounded-full hover:bg-gray-100 transition-colors duration-200'}
                            >
                                <Heart width={24} height={24} fill={'#FF3B30'} color={'#FF3B30'} />
                            </button>
                            <div className="sm:w-[140px] w-full">
                                <AddCart isPrice={product.price} isSize={product.size} isId={product.id} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
