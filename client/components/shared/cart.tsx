"use client"

import { useDeleteCartMutation, useGetCartQuery } from '@/store/apiSlice'
import Image from 'next/image'
import { CartForm } from './cart-form'
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CartUpdate } from './cart-update';

interface Cart {
    id: number
    size: string
    quantity: number
    total: number
    productId: number | null
    product: {
        name: string
        img: string[]
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
        <div className={"flex flex-col lg:flex-row gap-6 lg:gap-8"}>
            <div className={"flex-1 space-y-4 md:space-y-6"}>
                {!data || !data.cartItem.length ? (
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow text-center space-y-4">
                        <h1 className="text-xl md:text-2xl font-semibold">Корзина пуста</h1>
                        <Link 
                            className={"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium bg-black text-white px-6 py-3 hover:bg-[#222222] transition duration-150"} 
                            href={"/shop"}
                        >
                            Найти нужный товар
                        </Link>
                    </div>
                ) : (
                    <>
                        {validCartItems.map(el => (
                            <div key={el.id} className={"bg-white rounded-2xl shadow overflow-hidden"}>
                                <div className={"p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"}>
                                    <Link href={`/product/${el.productId}`} className="block md:w-[200px] md:shrink-0">
                                        <div className={"relative w-full aspect-square md:aspect-[4/3]"}>
                                            <Image 
                                                src={el.product.img[0]} 
                                                className={"object-cover rounded-xl"} 
                                                sizes="(max-width: 768px) 100vw, 200px" 
                                                fill 
                                                alt={el.product.name} 
                                            />
                                        </div>
                                    </Link>
                                    
                                    <div className={"flex flex-col md:flex-row flex-1 gap-4 md:gap-6"}>
                                        <div className={"flex-1 space-y-2"}>
                                            <h3 className={"font-medium text-lg"}>{el.product.name}</h3>
                                            <p className={"text-[#737373]"}>Размер: {el.size}</p>
                                            <CartUpdate quantity={el.quantity} id={el.id} />
                                        </div>
                                        
                                        <div className={"flex md:flex-col items-center md:items-end gap-4 justify-between"}>
                                            <div className="text-right">
                                                <div className={"font-medium text-lg"}>{el.total.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                                <div className={cn("text-sm text-[#737373] line-through", el.totalDiscount === 0 && "hidden")}>
                                                    {el.totalDiscount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => handleDeleteCart(el.id)} 
                                                variant="outline"
                                                className={"hover:bg-red-50 hover:text-red-600 transition-colors"}
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        <div className={"bg-white p-4 md:p-6 shadow rounded-2xl space-y-2"}>
                            <div className={"flex justify-between text-[#737373]"}>
                                <span>Товары:</span>
                                <span>{totalPriceDiscount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className={"flex justify-between text-[#737373]"}>
                                <span>Скидка:</span>
                                <span className="text-red-500">-{totalDiscountSum.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className={"h-px bg-gray-100 my-2"} />
                            <div className={"flex justify-between font-medium text-lg"}>
                                <span>Итого:</span>
                                <span>{totalSum.toLocaleString("ru-RU", { style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="lg:w-[400px] shrink-0">
                <CartForm refetch={refetch} />
            </div>
        </div>
    )
}