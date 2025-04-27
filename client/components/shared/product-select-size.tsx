import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
    className?: string
    isSize: Array<string>
}

export const ProductSelectSize: React.FC<Props> = ({ isSize }) => {
    return (
        <Select>
            <SelectTrigger className={"w-[467px]"}>
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