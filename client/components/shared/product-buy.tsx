import React from 'react'
import { BuyOneclickForm } from './buy-oneclick-form'

interface Props {
    isEdit: boolean
    isPrice: number
    isDiscount: number
    isSize: Array<string>
}

export const ProductBuy = ({ isPrice, isDiscount, isSize, isEdit }: Props) => {
    return (
        <div className={"bg-[#F8F8F8] w-[345px] h-[195px] rounded-2xl"}>
            <div className='flex flex-col justify-between items-start w-[313px] h-full py-[27px] m-auto'>
                <div className='flex items-center'>
                    {isEdit
                        ? 
                        ""
                        : 
                        <>
                            <span className={"text-2xl  text-[#6E6E73]"}>{isPrice.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            {isDiscount !== 0 && <span className='pl-4 line-through text-[18px] text-[#6E6E73]'>{isDiscount.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>}
                        </>
                    }
                </div>
                <BuyOneclickForm isPrice={isPrice} isSize={isSize} />
                <button className={"bg-[#E5E5EA] text-[#6E6E73] rounded-2xl w-[313px] h-[39px] cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>В корзину</button>
            </div>
        </div >
    )
}