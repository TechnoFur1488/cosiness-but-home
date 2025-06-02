import { useDeleteForeverMutation, usePostForeverMutation } from "@/store/apiSlice"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useFavorite } from "../hooks/use-favorite"

interface Props {
    isId: number
}

export const FavoriteProduct = ({ isId }: Props) => {
    const [postForever] = usePostForeverMutation()
    const [deleteForever] = useDeleteForeverMutation()
    const { isProductInFavorite } = useFavorite()

    const onFavoriteClickPost = async (isId: number) => {
        try {
            await postForever(isId).unwrap()
        } catch (err) {
            alert("Не смогли добавить в избранное")
            console.error(err)
        }
    }

    const onFavoriteClickDelete = async (isId: number) => {
        try {
            await deleteForever(isId).unwrap()
        } catch (err) {
            alert("Не смогли удалить")
            console.error(err)
        }
    }

    return (
        <button className={"absolute z-20 p-4 right-0 top-0"} onClick={() => { isProductInFavorite(isId) ? onFavoriteClickDelete(isId) : onFavoriteClickPost(isId) }}>
            {isProductInFavorite(isId) ?
                <Heart size={20} fill="red" stroke="red" />
                :
                <Heart size={20} fill="white" stroke="black" />
            }
        </button>
    )

}