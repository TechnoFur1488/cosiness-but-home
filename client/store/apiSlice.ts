import { Rating } from "@/components/shared"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Products {
    id: number
    img: Array<string>
    name: string
    price: number
    discount: number
    compound: string
    warp: string
    hight: number
    hardness: number
    size: Array<string>
    description: string
}

interface Rating {
    id: number,
    name: string,
    grade: number,
    gradeText: string,
    img: Array<string>,
    productId: number
}

interface PostRating {
    name: string
    grade: number
    gradeText?: string
    img?: Array<string>
}

interface ProductsResponse {
    products: Products[];
    hasMore: boolean;
    nextOffset: number;
}

interface Order {
    mail: string
    name: string
    adress: string
    phone: string
    delivery: string
    pay: string
    size: string
    quantity: number
    policy: boolean
}


export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_APP_API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token")
            if (token) {
                headers.set("authorization", `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ["Product", "Rating", "Order"],
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, number | void>({
            query: (offset = 0) => `/api/products?offset=${offset}`,
            providesTags: ["Product"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newItems) => {
                currentCache.products.push(...newItems.products)
                currentCache.hasMore = newItems.hasMore
                currentCache.nextOffset = newItems.nextOffset
            },
            forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg
        }),
        getOneProducts: builder.query<{ product: Products }, number | void>({
            query: (id) => `/api/products/${id}`,
            providesTags: ["Product"]
        }),
        getRating: builder.query<{rating: Rating[]}, number>({
            query: (productId) => `/api/rating/${productId}`,
            providesTags: ["Rating"]
        }),
        postRating: builder.mutation<PostRating, { productId: number, newRating: PostRating}> ({
            query: ({ productId, newRating }) => ({
                url: `/api/rating/${productId}`,
                method: "POST",
                body: newRating
            }),
            invalidatesTags: ["Rating"]
        }),
        postOrderOne: builder.mutation<Order, { productId: number, newOrder: Order }>({
            query: ({ productId, newOrder }) => ({
                url: `/api/order/${productId}`,
                method: "POST",
                body: newOrder
            }),
            invalidatesTags: ["Order"]
        })
    })
})

export const {
    useLazyGetProductsQuery,
    useGetOneProductsQuery,
    useGetRatingQuery,
    usePostRatingMutation,
    usePostOrderOneMutation,
} = apiSlice