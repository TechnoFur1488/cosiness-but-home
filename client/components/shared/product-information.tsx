import React from 'react'
import { ModalInformation } from './modal-information'
import { ProductSelectSize } from './product-select-size'

interface Props {
    className?: string
    isName: string
    isCompound: string
    isWarp: string
    isHight: number
    isHardness: number
    isSize: Array<string>
    isDescription: string
}

export const ProductInformation: React.FC<Props> = ({ isName, isCompound, isWarp, isHight, isHardness, isSize, isDescription }) => {
    let description: string = isDescription

    if (description.length > 150) {
        description = description.slice(0, 150) + "..."
    }

    return (
        <div className={"w-[467px] flex flex-col justify-between"}>
            <h1 className={"font-medium text-[40px]"}>{isName}</h1>
            <h2 className={"py-[10px] font-medium text-[32px]"}>Характеристики</h2>
            <div className={"flex h-30 justify-between flex-col"}>
                <span><span className={" text-[#6E6E73]"}>Состав:</span> {isCompound}</span>
                <span><span className={" text-[#6E6E73]"}>Основа:</span> {isWarp}</span>
                <span><span className={" text-[#6E6E73]"}>Высота ворса:</span> {isHight} мм</span>
                <span><span className={" text-[#6E6E73]"}>Плотность:</span> {isHardness} </span>
            </div>
            <h2 className={"py-[10px] text-[32px] font-medium"}>Размеры</h2>
            <div>
                <ProductSelectSize isSize={isSize} />
            </div>
            <h2 className={"py-[10px] text-[32px] font-medium"}>Описание</h2>
            <p className={"text-[#6E6E73] "}>
                {description}
                <ModalInformation >
                    {isDescription}
                </ModalInformation>
            </p>
        </div>
    )
}