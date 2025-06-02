import { Pencil } from "lucide-react"
import { Button } from "../ui/button"
import { useGetCartQuery, useGetForeverQuery, useUpdateProductMutation } from "@/store/apiSlice"
import { ParamValue } from "next/dist/server/request/params"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"

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
    isExistingImages: string[] | undefined
    isCatalogId: number
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
    isFrom,
    isExistingImages,
    isCatalogId
}: Props) => {
    const [updateProductOption] = useUpdateProductMutation()
    const { refetch } = useGetCartQuery()
    const { refetch: favorite } = useGetForeverQuery()
    const role = useTokenDecryptor()

    const handleClickUpdateProductOption = async (id: ParamValue) => {
        const formData = new FormData()

        formData.append("id", String(id))
        formData.append("existingImg", JSON.stringify(isExistingImages))
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
        formData.append("catalogId", String(isCatalogId))

        try {
            await updateProductOption(formData).unwrap()
            await refetch()
            await favorite()
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