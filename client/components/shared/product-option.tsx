"use client"

import { useGetOneProductsQuery } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import React from 'react'
import { ProductOptionImg, ProductInformation, ProductBuy } from './index'



interface Props {
    className?: string
}

interface Products {
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
}

export const ProductOption: React.FC<Props> = ({ }) => {
    const router = useParams()
    const productId = router.productId

    const { data, isLoading, isError } = useGetOneProductsQuery(Number(productId))

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    if (!data) return <div>Product not found</div>

    const product = data.product

    return (
        <div className={"flex justify-between"}>
            <ProductOptionImg isImg={product.img} />
            <ProductInformation
                isName={product.name}
                isCompound={product.compound}
                isWarp={product.warp}
                isHight={product.hight}
                isHardness={product.hardness}
                isSize={product.size}
                isDescription={product.description}
            />
            <ProductBuy isSize={product.size} isPrice={product.price} isDiscount={product.discount} />
        </div>
    )
}