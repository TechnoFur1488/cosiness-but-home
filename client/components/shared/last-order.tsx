import { useGetOrderQuery } from '@/store/apiSlice'
import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import Link from 'next/link'

export const LastOrder = () => {
    const { data, isLoading, isError } = useGetOrderQuery()

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>

    const order = data?.allOrderItems.rows

    const dataPublic = (component: string) => {
        let options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return new Date(component).toLocaleString("ru-RU", options)
    }

    return (
        <div className={"w-[40%]"}>
            <h2 className={"font-medium text-2xl"}>Последние заказы</h2>
            <ScrollArea className='h-266'>
                {order?.map((el) => (
                    <div key={el.id} className={"w-125"}>
                        <h3 className={"font-medium text-[20px] my-5"} >Заказ №{el.id}</h3>
                        <div className={"bg-[#E5E5EA] flex flex-col rounded-2xl p-3"}>
                            <span className={"font-medium py-1"}>Дата заказа: {dataPublic(el.createdAt)}</span>
                            <span className={"font-medium py-1"}>Почта: {el.mail}</span>
                            <span className={"font-medium py-1"}>Имя получателя: {el.name}</span>
                            <span className={"font-medium py-1"}>Адресс: {el.adress}</span>
                            <span className={"font-medium py-1"}>Номре Телефона: {el.phone}</span>
                            <span className={"font-medium py-1"}>Доставка: {el.delivery}</span>
                            <span className={"font-medium py-1"}>Оплата: {el.pay}</span>
                            <span className={"font-medium py-1"}>Всего: {el.total}</span>
                            <div>
                                <h4 className="font-medium">Товары:</h4>
                                <div className="space-y-2 mt-2 ml-2">
                                    {el.order_items.map((item) => (
                                        <div key={item.id} className={"flex flex-col"}>
                                            <Link className={"text-blue-600 hover:underline"} href={`/product/${item.productId}`}>{item.productName}</Link>
                                            <span>Кол-во: {item.quantity}</span> 
                                            <span>Цена: {item.price} руб.</span> 
                                            <span>Размер: {item.size}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}