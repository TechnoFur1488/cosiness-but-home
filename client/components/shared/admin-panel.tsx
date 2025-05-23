"use client"

import React, { useEffect, useState } from 'react'
import NotFound from '@/app/not-found'
import { CreateProduct } from './create-product'
import { LastOrder } from './last-order'


export const AdminPanel= () => {
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {

            try {
                const tokenParts = token.split(".")
                const decodedPayload = JSON.parse(atob(tokenParts[1]).replace(/-/g, "+").replace(/_/g, "/"))

                const userRole = decodedPayload.role
                setRole(userRole)
            } catch (err) {
                console.error('Ошибка декодирования токена:', err)
            }

        }
    }, [])

    return (
        <div>
            {role === "ADMIN"
                ? <div className={"flex justify-between"}>
                    {/* <span>Hello </span>
                    {role} */}
                    <CreateProduct />
                    <LastOrder />
                </div>
                : <NotFound />
            }
        </div>
    )
}