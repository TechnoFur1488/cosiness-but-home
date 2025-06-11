import { useGetCartQuery } from "@/store/apiSlice"

export const useCart = () => {
    const { data } = useGetCartQuery()

    const isProductInCart = (productId: number, size: string) => {
        return data?.cartItem?.some(item => item.productId === productId && item.size === size) || false
    }

    return {
        isProductInCart,
        cartItems: data?.cartItem || []
    }
}