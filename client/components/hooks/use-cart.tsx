import { useGetCartQuery } from "@/store/apiSlice"

export const useCart = () => {
    const { data } = useGetCartQuery()

    const isProductInCart = (productId: number) => {
        return data?.cartItem?.some(item => item.productId === productId) || false
    }

    return {
        isProductInCart,
        cartItems: data?.cartItem || []
    }
}