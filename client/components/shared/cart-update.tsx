"use client"

import { useUpdateCartMutation } from "@/store/apiSlice"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Minus, Plus } from "lucide-react"

interface Props {
    id: number
    quantity: number
}

export const CartUpdate = ({ quantity, id }: Props) => {
    const [updateCart] = useUpdateCartMutation()
    const [quantityProduct, setQuantityProduct] = useState(quantity)

    useEffect(() => {
        setQuantityProduct(quantity)
    }, [quantity])

    const handleClickQuantity = async (newQuantity: number) => {
        try {
            await updateCart({ id, quantity: newQuantity }).unwrap()
            setQuantityProduct(newQuantity)
        } catch (err) {
            console.error(err)
            alert("не смогли изменить количество")
        }
    }

    const handleIncrement = () => {
        handleClickQuantity(quantityProduct + 1)
    }

    const handleDecrement = () => {
        if (quantityProduct > 1) {
            handleClickQuantity(quantityProduct - 1)
        }
    }

    return (
        <div className="flex items-center gap-1">
            <Button 
                onClick={handleDecrement}
                disabled={quantityProduct <= 1}
                className={"w-1 h-1"}
            >
                <Minus size={10} />
            </Button>
            <span className="text-[#737373]">
                количество: {quantityProduct}
            </span>
            <Button className={"w-1 h-1"} onClick={handleIncrement}>
                <Plus size={10} />
            </Button>
        </div>
    )
}