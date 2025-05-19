import { Pencil } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { useUpdateProductMutation } from "@/store/apiSlice"
import { ParamValue } from "next/dist/server/request/params"

interface Props {
    isIdProduct: ParamValue
    isEdit: boolean
    isSetEdit: React.Dispatch<React.SetStateAction<boolean>>
    isEditFunction: () => void
    isName: string
    isCompound: string
    isWarp: string
    isHight: number
    isHardness: number
    isSize: string
    isDescription: string
    isPrice: number
    isDiscount: number
    isImage: File[]
    isFrom: string
}

export const UpdateProduct = ({
    isIdProduct,
    isEdit,
    isSetEdit,
    isEditFunction,
    isName,
    isCompound,
    isWarp,
    isHight,
    isHardness,
    isSize,
    isDescription,
    isPrice,
    isDiscount,
    isImage,
    isFrom
}: Props) => {
    const [role, setRole] = useState<string | null>(null)
    const [updateProductOption] = useUpdateProductMutation()

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

    const handleClickUpdateProductOption = async (id: ParamValue) => {
        const formData = new FormData()

        formData.append("id", String(id))
        isImage.forEach((file) => {
            formData.append("img", file)
        })
        formData.append("name", isName)
        formData.append("price", String(isPrice))
        formData.append("discount", String(isDiscount))
        formData.append("compound", isCompound)
        formData.append("warp", isWarp)
        formData.append("hight", String(isHight))
        formData.append("hardness", String(isHardness))
        formData.append("size", isSize)
        formData.append("description", isDescription)
        formData.append("from", isFrom)

        try {
            await updateProductOption(formData).unwrap()
            isSetEdit(false)
        } catch (err) {
            alert("Не смогли обновить товар")
            console.error(err)
        }
    }

    return (
        <>
            {role === "ADMIN" &&
                <>
                    {isEdit
                        ?
                        <div className={"mb-3"}>
                            <Button onClick={() => handleClickUpdateProductOption(isIdProduct)} className={"mr-2 bg-[#E5E5EA]  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>Сохранить</Button>
                            <Button className={"bg-white cursor-pointer"} variant={"outline"} onClick={() => isSetEdit(false)}>Отменить</Button>
                        </div>
                        :
                        <div className={"absolute left-4 top-4 z-2"}>
                            <button onClick={() => {
                                if (isEdit) {
                                    isSetEdit(false)
                                } else {
                                    isEditFunction()
                                }
                            }}>
                                <Pencil fill="#E5E5EA" color="black" className={"cursor-pointer"} />
                            </button>
                        </div>
                    }
                </>
            }
        </>
    )
}