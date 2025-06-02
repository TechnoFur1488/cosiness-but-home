"use client"

import { BuyOneclickForm } from './buy-oneclick-form'
import { Input } from '../ui/input'
import { useGetCatalogQuery, usePostCartMutation } from '@/store/apiSlice'
import { ParamValue } from 'next/dist/server/request/params'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../hooks/use-cart'
import { Button } from '../ui/button'
import { ProductSelectCatalog } from './product-select-catalog'

interface Props {
    isEdit: boolean
    isPrice: number
    isDiscount: number
    isSize: Array<string>
    isSelectedSize: string
    isProductId: ParamValue

    editPrice: number
    setEditPrice: React.Dispatch<React.SetStateAction<number>>

    editDiscount: number
    setEditDiscount: React.Dispatch<React.SetStateAction<number>>

    setEditCatalogId: React.Dispatch<React.SetStateAction<number>>
    editCatalogId: number
}

const priceOfSize = (priceProduct: number, sizeProduct: string) => {
    if (!sizeProduct) return priceProduct

    try {
        const [w, l] = sizeProduct.split("x").map(Number)
        const squareMeters = w * l

        return (priceProduct * squareMeters)
    } catch (err) {
        console.error("Ошибка расчета цены", err)
        return 0
    }
}

export const ProductBuy = ({ isPrice, editCatalogId, setEditCatalogId, isProductId, isSelectedSize, isDiscount, isSize, isEdit, editPrice, setEditPrice, editDiscount, setEditDiscount }: Props) => {
    const [cartStatus, setCartStatus] = useState(false)
    const [postCart] = usePostCartMutation()
    const { isProductInCart } = useCart()

    useEffect(() => {
        if (isProductInCart(Number(isProductId))) {
            setCartStatus(true)
        }
    }, [isProductId, isProductInCart])

    const handleClickAddCart = async () => {
        try {
            await postCart({
                newCart: {
                    productId: Number(isProductId),
                    quantity: 1,
                    size: isSelectedSize
                }
            }).unwrap()
        } catch (err) {
            setCartStatus(false)
            alert("Не смогли добавить в корзину товар")
            console.error(err)
        }
    }

    return (
        <div>
            {isEdit
                ?
                <div className={"space-y-2"}>
                    <Input type='number' value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} />
                    <Input type='number' value={editDiscount} onChange={e => setEditDiscount(Number(e.target.value))} />
                    <h2 className={"font-bold text-[18px]"}>Каталог товара</h2>
                    <ProductSelectCatalog editCatalogId={editCatalogId} setEditCatalogId={setEditCatalogId} />
                </div>
                :
                <>
                    <div className={"font-light flex justify-between flex-col mb-3"}>
                        <span>{priceOfSize(isPrice, isSelectedSize).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                        {isDiscount !== 0 && <span className={'line-through text-[14px]'}>{priceOfSize(isDiscount, isSelectedSize).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>}
                    </div>
                    <div className={"flex flex-col w-50 space-y-3"}>
                        <Button disabled={!isSelectedSize} onClick={() => { handleClickAddCart(), setCartStatus(true) }} className={"cursor-pointer"}>В корзину</Button>
                        <BuyOneclickForm isPrice={isPrice} isSize={isSize} />
                    </div>
                </>
            }
        </div >
    )
}