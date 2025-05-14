"use client"

import { useGetOneProductsQuery } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { ProductOptionImg, ProductInformation, ProductBuy } from './index'
import { UpdateProduct } from './update-product'



interface Props {
    className?: string
}

export const ProductOption: React.FC<Props> = ({ }) => {
    const [edit, setEdit] = useState(false)
    const router = useParams()
    const productId = router.productId

    const { data, isLoading, isError } = useGetOneProductsQuery(Number(productId))

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>
    if (!data) return <div>Product not found</div>

    const product = data.product

    return (
        <div className={"flex justify-between relative"}>
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
            <ProductBuy isEdit={edit} isSize={product.size} isPrice={product.price} isDiscount={product.discount} />
            <UpdateProduct isSetEdit={setEdit} isEdit={edit} />
        </div>
    )
}