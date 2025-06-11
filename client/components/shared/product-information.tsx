"use client"

import { ParamValue } from "next/dist/server/request/params"
import { ModalInformation } from "./modal-information"
import { ProductSelectSize } from "./product-select-size"
import { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { BuyOneclickForm } from "./buy-oneclick-form"
import { usePostCartMutation } from "@/store/apiSlice"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { ProductSelectCatalog } from "./product-select-catalog"

interface Props {
    isName: string
    isCompound: string
    isWarp: string
    isHight: number
    isHardness: number
    isSize: string[]
    isDescription: string
    isFrom: string
    isPrice: number
    isDiscount: number
    isProductId: ParamValue

    isSelectedSize: string
    isSetSelectedSize: React.Dispatch<React.SetStateAction<string>>

    isEdit: boolean

    editName: string
    setEditName: React.Dispatch<React.SetStateAction<string>>

    editCompound: string
    setEditCompound: React.Dispatch<React.SetStateAction<string>>

    editWarp: string
    setEditWarp: React.Dispatch<React.SetStateAction<string>>

    editHight: number
    setEditHight: React.Dispatch<React.SetStateAction<number>>

    editHardness: number
    setEditHardness: React.Dispatch<React.SetStateAction<number>>

    editSize: string
    setEditSize: React.Dispatch<React.SetStateAction<string>>

    editDescription: string
    setEditDescription: React.Dispatch<React.SetStateAction<string>>

    editFrom: string
    setEditFrom: React.Dispatch<React.SetStateAction<string>>

    editPrice: number
    setEditPrice: React.Dispatch<React.SetStateAction<number>>

    editDiscount: number
    setEditDiscount: React.Dispatch<React.SetStateAction<number>>

    setEditCatalogId: React.Dispatch<React.SetStateAction<number>>
    editCatalogId: number
}

export const ProductInformation = ({
    isName,
    isCompound,
    isWarp,
    isHight,
    isHardness,
    isSize,
    isDescription,
    isFrom,
    isPrice,
    isDiscount,
    isProductId,

    isSelectedSize,
    isSetSelectedSize,

    isEdit,

    editName,
    setEditName,

    editCompound,
    setEditCompound,

    editWarp,
    setEditWarp,

    editHight,
    setEditHight,

    editHardness,
    setEditHardness,

    editSize,
    setEditSize,

    editDescription,
    setEditDescription,

    editFrom,
    setEditFrom,

    editPrice,
    setEditPrice,

    editDiscount,
    setEditDiscount,

    editCatalogId,
    setEditCatalogId
}: Props) => {
    const [isProductInCart, setIsProductInCart] = useState(false)
    const [postCart] = usePostCartMutation()

    const handleClickAddCart = async () => {
        try {
            await postCart({
                newCart: {
                    productId: Number(isProductId),
                    quantity: 1,
                    size: isSelectedSize
                }
            }).unwrap()
            setIsProductInCart(true)
        } catch (err) {
            setIsProductInCart(false)
            alert("Не смогли добавить в корзину товар")
            console.error(err)
        }
    }

    let description: string = isDescription

    if (description.length > 150) {
        description = description.slice(0, 220) + "... "
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

    return (
        <>
            {isEdit
                ?
                <div className={"flex flex-col justify-between my-0 space-y-3"}>
                    <Input className={"h-[33px] font-bold text-[18px] lg:text-[22px]"} type='text' value={editName} onChange={e => setEditName(e.target.value)} />
                    <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Выбрать размер</h2>
                    <Textarea value={editSize} onChange={e => setEditSize(e.target.value)} />
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Цена</h2>
                    <Input value={editPrice} type="number" onChange={e => setEditPrice(Number(e.target.value))} />
                    <span className="text-[14px] lg:text-base">Скидка</span>
                    <Input value={editDiscount} type="number" onChange={e => setEditDiscount(Number(e.target.value))} />
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Информация о товаре</h2>
                    <div className={"text-xs lg:text-sm font-light"}>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-3 lg:mb-4"} />
                        <div className={"flex justify-between mb-4 lg:mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Состав:</span>
                                <Input className={"w-100"} type='text' value={editCompound} onChange={e => setEditCompound(e.target.value)} />
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Основа</span>
                                <Input className={"w-100"} type='text' value={editWarp} onChange={e => setEditWarp(e.target.value)} />
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-3 lg:mb-4"} />
                        <div className={"flex justify-between mb-4 lg:mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Высота ворса</span>
                                <Input className={"w-100"} type="number" value={editHight} onChange={e => setEditHight(Number(e.target.value))} />мм
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Плотность</span>
                                <Input className={"w-100"} type='number' value={editHardness} onChange={e => setEditHardness(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-3 lg:mb-4"} />
                        <div className={"flex justify-between mb-4 lg:mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Производитель</span>
                                <Input className={"w-100"} type='text' value={editFrom} onChange={e => setEditFrom(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Каталог</h2>
                    <ProductSelectCatalog editCatalogId={editCatalogId} setEditCatalogId={setEditCatalogId} />
                </div>
                :
                <div className={"mt-6 lg:mt-9 space-y-2 lg:space-y-3"}>
                    <h1 className={"text-[18px] lg:text-[22px] font-bold"}>{isName}</h1>
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Описание</h2>
                    <p className={"text-sm lg:text-base font-light"}>
                        {description}
                        {description.length > 150 &&
                            <ModalInformation>
                                {isDescription}
                            </ModalInformation>
                        }
                    </p>
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Выбрать размер</h2>
                    <ProductSelectSize isProductId={isProductId} setIsProductInCart={setIsProductInCart} selectSize={isSetSelectedSize} isSize={isSize} />
                    <span className="text-sm lg:text-base">{isProductInCart && "Товар в корзине"}</span>
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Цена</h2>
                    <div className={"font-light flex justify-between flex-col"}>
                        <span className="text-sm lg:text-base">{priceOfSize(isPrice, isSelectedSize).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                        <span className={'line-through text-[12px] lg:text-[14px]'}>{isDiscount > 0 && priceOfSize(isDiscount, isSelectedSize).toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                    </div>
                    <div className={"flex flex-col lg:w-50 space-y-2 lg:space-y-3"}>
                        {isProductInCart
                            ?
                            <Link className={"text-xs lg:text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-8 lg:h-9 px-3 lg:px-4 py-2 has-[>svg]:px-3 cursor-pointer"} href={"/cart"}>Перейти в корзину</Link>
                            :
                            <Button disabled={!isSelectedSize} onClick={() => handleClickAddCart()} className={"text-xs lg:text-sm h-8 lg:h-9 cursor-pointer"}>В корзину</Button>
                        }
                        <BuyOneclickForm isPrice={isPrice} isSize={isSize} />
                    </div>
                    <h2 className={"font-bold text-[16px] lg:text-[18px]"}>Информация о товаре</h2>
                    <div className={"text-xs lg:text-sm font-light"}>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-3 lg:mb-4"} />
                        <div className={"flex justify-between mb-4 lg:mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Состав</span>
                                <span className="text-xs lg:text-sm">{isCompound}</span>
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Основа</span>
                                <span className="text-xs lg:text-sm">{isWarp}</span>
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-3 lg:mb-4"} />
                        <div className={"flex justify-between mb-4 lg:mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Высота ворса</span>
                                <span className="text-xs lg:text-sm">{isHight} мм</span>
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Плотность</span>
                                <span className="text-xs lg:text-sm">{isHardness.toLocaleString("ru-RU")}</span>
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-3 lg:mb-4"} />
                        <div className={"flex justify-between mb-4 lg:mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373] text-xs lg:text-sm"}>Производитель</span>
                                <span className="text-xs lg:text-sm">{isFrom}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}