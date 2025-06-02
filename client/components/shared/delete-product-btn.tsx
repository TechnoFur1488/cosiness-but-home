"use client"

import { cn } from '@/lib/utils'
import { useDeleteProductMutation, useGetForeverQuery, useLazyGetProductsQuery } from '@/store/apiSlice'
import { Trash2 } from 'lucide-react'
import { useTokenDecryptor } from '../hooks/use-token-decryptor'
import React, { useState } from 'react'

interface Props {
    isId: number
}

export const DeleteProductBtn = ({ isId }: Props) => {
    const { refetch } = useGetForeverQuery()
    const [deleteProducts, setDeleteProducts] = useState(false)
    const [deleteProduct] = useDeleteProductMutation()
    const role = useTokenDecryptor()

    const handleClickDeleteProduct = async (id: number) => {
        try {
            setDeleteProducts(true)
            await deleteProduct(id).unwrap()
            await refetch()
        } catch (err) {
            setDeleteProducts(false)
            alert("Не удалось удалить")
            console.error(err)
        }
    }

    return (
        <>
            {role === "ADMIN" && (
                <>
                    <button className={cn("cursor-pointer p-4 absolute top-0 left-0 z-30")} onClick={() => handleClickDeleteProduct(isId)}>
                        <Trash2 size={20} color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                    </button>
                    {deleteProducts &&
                        <>
                            <div className={"absolute top-0 left-0 w-full h-full bg-gray-300 opacity-50 z-31 rounded-2xl flex justify-center items-center"} />
                            <span className={"opacity-100 z-32 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}>Удалено</span>
                        </>
                    }
                </>
            )}
        </>
    )
}