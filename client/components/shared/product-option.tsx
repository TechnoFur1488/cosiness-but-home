"use client"

import { useGetOneProductsQuery } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { ProductOptionImg, ProductInformation, ProductBuy } from './index'
import { UpdateProduct } from './update-product'
import { ProductOptionLoading } from '../status/product-option-loading'

export const ProductOption = () => {
    const [selectedSize, setSelectedSize] = useState<string>("")
    const router = useParams()
    const productId = router.productId

    const { data, isLoading, isError } = useGetOneProductsQuery(Number(productId))

    const [edit, setEdit] = useState(false)
    const [name, setName] = useState("")
    const [compound, setCompound] = useState("")
    const [warp, setWarp] = useState("")
    const [hight, setHight] = useState(0)
    const [hardness, setHardness] = useState<number>(0)
    const [size, setSize] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [from, setFrom] = useState("")
    const [image, setImage] = useState<File[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [catalogId, setCatalogId] = useState(0)

    if (isLoading) return <ProductOptionLoading />
    if (isError) return <div>Error</div>
    if (!data) return <div>Product not found</div>

    const product = data.product

    let sizes = product.size.join(" ")

    const handlEdit = () => {
        setName(product.name)
        setCompound(product.compound)
        setWarp(product.warp)
        setHight(product.hight)
        setHardness(product.hardness)
        setSize(sizes)
        setDescription(product.description)
        setFrom(product.from)

        setPrice(product.price)
        setDiscount(product.discount)

        setEdit(true)

        setCatalogId(product.catalogId)
    }

    return (
        <div className={"flex justify-between flex-col relative"}>
            <div>
                <UpdateProduct
                    isSetEdit={setEdit}
                    isEdit={edit}
                    isEditFunction={handlEdit}
                    isName={name}
                    isCompound={compound}
                    isWarp={warp}
                    isHight={hight}
                    isHardness={hardness}
                    isSize={size}
                    isDescription={description}
                    isPrice={price}
                    isDiscount={discount}
                    isImage={image}
                    isIdProduct={productId}
                    isFrom={from}
                    isExistingImages={existingImages}
                    isCatalogId={catalogId}
                />
                <ProductOptionImg
                    isImg={product.img || []}
                    isEdit={edit}
                    editImage={image}
                    setEditImage={setImage}
                    isExistingImages={existingImages}
                    isSetExistingImages={setExistingImages}
                />
            </div>
            <ProductInformation
                isName={product.name}
                isCompound={product.compound}
                isWarp={product.warp}
                isHight={product.hight}
                isHardness={product.hardness}
                isSize={product.size}
                isDescription={product.description}
                isFrom={product.from}
                isPrice={product.price}
                isDiscount={product.discount}
                isProductId={productId}
                isSelectedSize={selectedSize}

                isEdit={edit}

                editName={name}
                setEditName={setName}

                editCompound={compound}
                setEditCompound={setCompound}

                editWarp={warp}
                setEditWarp={setWarp}

                editHight={hight}
                setEditHight={setHight}

                editHardness={hardness}
                setEditHardness={setHardness}

                editSize={size}
                setEditSize={setSize}

                editDescription={description}
                setEditDescription={setDescription}

                editFrom={from}
                setEditFrom={setFrom}

                selectSize={setSelectedSize}

                editPrice={price}
                setEditPrice={setPrice}

                editDiscount={discount}
                setEditDiscount={setDiscount}

                editCatalogId={catalogId}
                setEditCatalogId={setCatalogId}
            />
        </div>
    )
}