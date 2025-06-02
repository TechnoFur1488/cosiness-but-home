"use client"

import { useDeleteCartMutation, useGetCartQuery } from '@/store/apiSlice'
import Image from 'next/image'
import { Heart, Minus, Plus, Trash2 } from 'lucide-react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { CartForm } from './cart-form'
import { useEffect } from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import { requestToBodyStream } from 'next/dist/server/body-streams';

interface Cart {
    id: number
    size: Array<string>
    quantity: number
    total: number
    productId: number | null
    product: {
        name: string
        img: Array<string>
    }
}


export const Cart = () => {
    const { data, isLoading, isError, refetch } = useGetCartQuery()
    const [deleteCart] = useDeleteCartMutation()

    if (isLoading) return <h1>Загрузка</h1>
    if (isError) return <h1>Ошибка</h1>

    const handleDeleteCart = async (id: number) => {
        try {
            await deleteCart(id).unwrap()
        } catch (err) {
            alert("Не смогли удалить товар из корзины")
            console.error(err)
        }
    }

    const validCartItems = data?.cartItem ? data.cartItem.filter((item: Cart) => item.productId !== null) : []
    
    const total = validCartItems.map((el) => el.total)
    const totalDiscount = validCartItems.map(el => el.totalDiscount)

    const totalSum = total.reduce((sum, num) => sum + num, 0)
    const totalDiscountSum = totalDiscount.reduce((sum, num) => sum + num, 0)

    const totalPriceDiscount = totalSum + totalDiscountSum

    return (
        <div className={"flex justify-between"}>
            <div className={"w-full mr-9 space-y-5"}>
                {!data || !data.cartItem.length ? (
                    <div className="bg-white p-3 rounded-2xl shadow text-center space-y-2">
                        <h1>Корзина пуста</h1>
                        <Link className={"w-50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground h-9 px-4 py-2 has-[>svg]:px-3 bg-black shadow cursor-pointer hover:bg-[#222222] transition duration-150"} href={"/shop"}>Найти нужный товар</Link>
                    </div>
                ) : (
                    <>
                        {validCartItems.map(el => {
                            return (
                                <div key={el.id} className={"flex justify-between bg-white p-3 rounded-2xl shadow"}>
                                    <Link href={`/product/${el.productId}`}>
                                        <div className={"flex items-center"}>
                                            <div className={"relative w-17.5 h-17.5"}>
                                                <Image src={el.product.img[0]} className={"object-cover rounded-2xl"} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill alt={"asd"} />
                                            </div>
                                            <div className={"flex flex-col ml-4"}>
                                                <span className={"font-medium"}>{el.product.name}</span>
                                                <span className={"text-[#737373]"}>количество: {el.quantity}</span>
                                                <span className={"text-[#737373]"}>Размер: {el.size}</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className={"flex flex-col items-center justify-between"}>
                                        <span>{el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                        <span className={"line-through text-sm"}>{el.totalDiscount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                        <Button onClick={() => handleDeleteCart(el.id)} className={"cursor-pointer"}>Удалить</Button>
                                    </div>
                                </div>
                            )
                        })}
                        <div className={"flex flex-col space-y-1 bg-white p-2 shadow rounded-2xl w-50"}>
                            <span className={"text-[#737373]"}>Товары: {totalPriceDiscount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            <span className={"text-[#737373]"}>Скидка: -{totalDiscountSum.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            <span className={"text-[#737373]"}>Итого: {totalSum.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </div>
                    </>
                )}
            </div>
            <CartForm refetch={refetch} />
        </div>
    )
}