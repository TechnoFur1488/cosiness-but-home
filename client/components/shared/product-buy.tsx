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

    setEditCatalogId: React.Dispatch<React.SetStateAction<string>>
    editCatalogId: string
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
    const { data, isLoading, isError } = useGetCatalogQuery()

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

    console.log(editCatalogId);
    
    return (
        <>
            <div className={"bg-[#F8F8F8] w-[345px] h-[195px] rounded-2xl"}>
                <div className='flex flex-col justify-between items-start w-[313px] h-full py-[27px] m-auto'>
                    <div className='flex items-center'>
                        {isEdit
                            ?
                            <>
                                <Input type='number' value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} />
                                <Input type='number' value={editDiscount} onChange={e => setEditDiscount(Number(e.target.value))} />
                            </>
                            :
                            <>
                                <span className={"text-2xl  text-[#6E6E73]"}>{priceOfSize(isPrice, isSelectedSize).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                                {isDiscount !== 0 && <span className='pl-4 line-through text-[18px] text-[#6E6E73]'>{priceOfSize(isDiscount, isSelectedSize).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>}
                            </>
                        }
                    </div>
                    <BuyOneclickForm isPrice={isPrice} isSize={isSize} />
                    {cartStatus
                        ?
                        <Link className={"flex justify-center items-center bg-[#DBDBDB] text-[#6E6E73] rounded-2xl w-[313px] h-[39px] cursor-pointer hover:bg-[#c2c2c2] transition duration-150"} href={"/cart"}>Добавлено в корзину</Link>
                        :
                        <Button disabled={!isSelectedSize} onClick={() => { handleClickAddCart(), setCartStatus(true) }} className={"bg-[#E5E5EA] text-[#6E6E73] rounded-2xl w-[313px] h-[39px] cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>В корзину</Button>}
                </div>
                {isEdit && <ProductSelectCatalog editCatalogId={editCatalogId}  dataCatalog={data?.catalogs} setEditCatalogId={setEditCatalogId} />}
            </div >
        </>
    )
}