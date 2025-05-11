"use client"

import React, { useEffect, useState } from 'react'
import NotFound from '@/app/not-found'

interface Props {
    className?: string
}

export const AdminPanel: React.FC<Props> = ({ className }) => {
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
        <div className={className}>
            {role === "ADMIN"
                ? <div>
                    <span>Hello </span>
                    {role}
                </div>
                : <NotFound />
            }
        </div>
    )
}