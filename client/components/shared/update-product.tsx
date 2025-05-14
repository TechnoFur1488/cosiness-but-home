import { Pencil } from "lucide-react"
import React, { useEffect, useState } from "react"

interface Props {
    isEdit: boolean
    isSetEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateProduct = ({ isEdit, isSetEdit }: Props) => {
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
        <>
            {role === "ADMIN" ?
                <div className={"absolute left-4 top-4 z-60"}>
                    <button onClick={() => isSetEdit(!isEdit)}>
                        <Pencil fill="#E5E5EA" color="black" className={"cursor-pointer"} />
                    </button>
                </div>
                : null
            }
        </>
    )
}