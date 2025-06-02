import { useGetForeverQuery } from "@/store/apiSlice"

export const useFavorite = () => {
    const { data } = useGetForeverQuery()

    const isProductInFavorite = (productId: number) => {
        return data?.foreverItem?.some(item => item.product.id === productId) || false
    }

    return {
        isProductInFavorite,
        foreverItem: data?.foreverItem || []
    }
}