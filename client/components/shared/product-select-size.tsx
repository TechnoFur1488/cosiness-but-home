import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useCart } from '../hooks/use-cart'
import { ParamValue } from 'next/dist/server/request/params'

interface Props {
    isProductId: ParamValue
    isSize: string[]
    selectSize: React.Dispatch<React.SetStateAction<string>>
    setIsProductInCart: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProductSelectSize = ({ isSize, selectSize, isProductId, setIsProductInCart }: Props) => {
    const { isProductInCart } = useCart()

    const handleSizeChange = (value: string) => {
        selectSize(value)
        setIsProductInCart(isProductInCart(Number(isProductId), value))
    }

    return (
        <Select onValueChange={handleSizeChange}>
            <SelectTrigger className={"lg:w-[50%] w-full"}>
                <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
                {isSize.map((el, i) => {
                    return (
                        <SelectItem value={el} key={i}>{el}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}