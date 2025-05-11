"use client"

import { cn } from '@/lib/utils'
import { useDeleteProductMutation, useLazyGetProductsQuery } from '@/store/apiSlice'
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Props {
    isId: number
}

export const DeleteProductBtn: React.FC<Props> = ({ isId }) => {
    const [role, setRole] = useState<string | null>(null)
    const [deleteProduct] = useDeleteProductMutation()
    const [triggerGetProducts] = useLazyGetProductsQuery()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            try {
                const tokenParts = token.split(".")
                const decodedPayload = JSON.parse(atob(tokenParts[1]).replace(/-/g, "+").replace(/_/g, "/"))

                const userRole = decodedPayload.role
                setRole(userRole)
            } catch (err) {
                console.error(err)
            }
        }
    }, [])

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