import { useEffect, useState } from "react"

export const useTokenDecryptor = () => {
    const [role, setRole] = useState<string | null>(null)

    useEffect (() => {
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

    return role
}