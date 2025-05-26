"use client"

import { useDeleteForeverMutation, useGetForeverQuery } from '@/store/apiSlice'
import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { AddCart } from './add-cart'
import { ProductImg } from './product-img'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HiddenScrol } from '../utils'

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

export const Forever = ({ className }: Props) => {
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

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>

    return (
        <div className={cn("grid grid-cols-4 gap-x-5 gap-y-10 my-20", className)}>
            {data?.foreverItem?.map((el: Forever) => {

                const product = el.product

                return (
                    <div key={el.id} className="flex flex-col items-start justify-between relative">
                        <Link className="h-[550px] flex flex-col justify-between" href={`/product/${el.id}`}>
                            <ProductImg isImg={product.img} />
                            <span className="py-[13px]">{product.name}</span>
                            <div className="py-[9px]">
                                <span>
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
                        </Link>
                        <button onClick={() => handleClickDeleteForever(product.id)} className={'p-2 absolute top-1 right-1 z-20'}>
                            <Heart fill={'red'} color={"red"} />
                        </button>
                        <AddCart isPrice={product.price} isSize={product.size} isId={el.id} />
                    </div>
                )
            })}
        </div>
    )
}
{/* <button onClick={() => handleClickForever(el.id)}>
    <Heart />
</button> */}