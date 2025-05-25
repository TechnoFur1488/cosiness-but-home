"use client"

import { cn } from '@/lib/utils'
import { useDeleteProductMutation, useLazyGetProductsQuery } from '@/store/apiSlice'
import { Trash2 } from 'lucide-react'
import { useTokenDecryptor } from '../hooks/use-token-decryptor'

interface Props {
    isId: number
}

export const DeleteProductBtn = ({ isId }: Props) => {
    const [deleteProduct] = useDeleteProductMutation()
    const [triggerGetProducts] = useLazyGetProductsQuery()
    const role = useTokenDecryptor()

    const handleClickDeleteProduct = async (id: number) => {
        try {
            await deleteProduct(id).unwrap()
            await triggerGetProducts()
        } catch (err) {
            alert("Не удалось удалить")
            console.error(err)
        }
    }

    return (
        <>
            {role === "ADMIN" && (
                <button className={cn("cursor-pointer p-2 absolute top-0 left-0 z-30")} onClick={() => handleClickDeleteProduct(isId)}>
                    <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                </button>
            )}
        </>
    )
}