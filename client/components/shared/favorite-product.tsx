import { useDeleteForeverMutation, usePostForeverMutation } from "@/store/apiSlice"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"

interface Props {
    isId: number
    isFavorite: Set<unknown>
}

export const FavoriteProduct = ({ isId, isFavorite }: Props) => {
    const [postForever] = usePostForeverMutation()
    const [deleteForever] = useDeleteForeverMutation()
    const [optimisticFavorite, setOptimisticFavorite] = useState(() => isFavorite.has(isId))

    const onFavoriteClick = async (isId: number) => {
        setOptimisticFavorite(!optimisticFavorite)
        
        try {
            if (isFavorite.has(isId)) {
                await deleteForever(isId).unwrap()
            } else {
                await postForever(isId).unwrap()
            }
        } catch (err) {
            setOptimisticFavorite(isFavorite.has(isId))
            alert(isFavorite.has(isId) ? "Не смогли удалить из избранного" : "Не смогли добавить в избранное")
            console.error(err)
        }
    }

    useEffect(() => {
        setOptimisticFavorite(isFavorite.has(isId))
    }, [isFavorite, isId])

    return (
        <button 
            onClick={() => onFavoriteClick(isId)} 
            className={"p-2 absolute top-0 right-0 z-30 cursor-pointer"}
        >
            <Heart
                fill={optimisticFavorite ? 'red' : 'currentColor'}
                color={optimisticFavorite ? 'red' : 'black'}
                className={optimisticFavorite ? "text-red-500" : "text-[#E5E5EA]"}
            />
        </button>
    )
}