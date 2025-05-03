"use client"

import { useDeleteCartMutation, useGetCartQuery } from '@/store/apiSlice'
import React from 'react'
import Image from 'next/image'
import { Heart, Minus, Plus, Trash2 } from 'lucide-react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { CartForm } from './cart-form'


interface Props {
    className?: string
}

interface Cart {
    id: number
    size: Array<string>
    quantity: number
    total: number
    product: {
        name: string
        img: Array<string>
    }
}


export const Cart: React.FC<Props> = ({ className }) => {
    const { data, isLoading, isError } = useGetCartQuery()
    const [deleteCart] = useDeleteCartMutation()

    if (isLoading) return <h1>Загрузка</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Корзина пуста</h1>


    const handleDeleteCart = async (id: number) => {
        try {
            await deleteCart(id).unwrap
        } catch (err) {
            alert("Не смогли удалить товар из корзины")
            console.error(err)
        }
    }

    const total = data.cartItem.map((el) => el.total)

    return (
        <div className={"flex justify-between"}>
            <div>
                {data?.cartItem?.map((el: Cart) => {
                    // const [quantity, setQuantity] = useState([...el.quantity])

                    const altName = el.product.name

                    return (
                        <div className={"w-238 h-62 bg-[#F8F8F8] py-7 px-7.5 flex mb-2.5 rounded-2xl"} key={el.id}>
                            <div className={"w-[153px] h-[194px] relative shrink-0"}>
                                <Swiper spaceBetween={30} slidesPerView={1} className={"h-full w-full"}>
                                    {el.product.img.map((el, i) => (
                                        <SwiperSlide key={i} className={"!h-full"}>
                                            <div className={"relative h-full w-full"}>
                                                <Image
                                                    src={el} fill className={"rounded-2xl object-cover"} sizes="(max-width: 768px) 100vw, 345px" alt={altName} priority={i === 0} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className={"flex justify-between items-center w-full ml-15"}>
                                <div className={"flex flex-col justify-between items-start h-full w-40"}>
                                    <div className={'flex flex-col'}>
                                        <span className='mb-6 text-[20px] font-medium'>{el.product.name}</span>
                                        <span className='text-[20px] font-medium'>Размер: {el.size}</span>
                                    </div>
                                    <div className={'flex justify-between w-[108px]'}>
                                        <button className={" cursor-pointer w-[45px] h-[45px] bg-[#E5E5EA] rounded-2xl flex items-center justify-center hover:bg-[#DBDBDB] transition duration-150"}>
                                            <Heart width={30} height={30} fill='currentColor' className={"text-[#8E8E93]"} />
                                        </button>
                                        <button onClick={() => handleDeleteCart(el.id)} className={"cursor-pointer w-[45px] h-[45px] bg-[#E5E5EA] rounded-2xl flex items-center justify-center hover:bg-[#DBDBDB] transition duration-150"}>
                                            <Trash2 width={30} height={30} className={"text-[#8E8E93]"} />
                                        </button>
                                    </div>
                                </div>
                                <div className={"flex items-center justify-between w-[150px]"}>
                                    <button onClick={() => {el.id, el.quantity - 1}} className={" cursor-pointer w-10 h-10 bg-[#E5E5EA] rounded-2xl flex items-center justify-center hover:bg-[#DBDBDB] transition duration-150"}>
                                        <Minus width={32} height={32} />
                                    </button>
                                    <span className={"text-[26px] font-medium"}>{el.quantity}</span>
                                    <button onClick={() => {el.quantity + 1}} className={" cursor-pointer w-10 h-10 bg-[#E5E5EA] rounded-2xl flex items-center justify-center hover:bg-[#DBDBDB] transition duration-150"}>
                                        <Plus width={32} height={32} />
                                    </button>
                                </div>
                                <div className={'flex flex-col items-center w-40'}>
                                    <h2 className={"text-[26px] font-medium mb-7"}>Итог</h2>
                                    <span className={"text-2xl text-[#6E6E73]"}>{el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <CartForm isTotal={total} />
        </div>
    )
}