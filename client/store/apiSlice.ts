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
    catalogId: number
}

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: Array<string>
    productId: number
    createdAt: string
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

interface Catalog {
    id: number
    name: string
}

interface PostCart {
    size: string
    quantity: number
    productId: number
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
    tagTypes: ["Product", "Rating", "Order", "Catalog", "Cart"],
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


        getRating: builder.query<{ rating: Rating[] }, number>({
            query: (productId) => `/api/rating/${productId}`,
            providesTags: ["Rating"]
        }),
        postRating: builder.mutation<PostRating, FormData>({
            query: (formData) => ({
                url: `/api/rating/${formData.get("productId")}`,
                method: "POST",
                body: formData,
                credentials: "include"
            }),
            invalidatesTags: ["Rating"]
        }),
        deleteRating: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/rating/${id}`,
                method: "DELETE",
                credentials: "include"
            }),
            invalidatesTags: ["Rating"]
        }),
        updateRating: builder.mutation<PostRating, FormData>({
            query: (formData) => ({
                url: `/api/rating/${formData.get("id")}`,
                method: "PUT",
                body: formData,
                credentials: "include"
            }),
            invalidatesTags: ["Rating"]
        }),


        getCatalog: builder.query<{ catalogs: Catalog[] }, void>({
            query: () => "/api/catalog",
            providesTags: ["Catalog"]
        }),
        getProductsCatalog: builder.query<ProductsResponse, { catalogId: number, offset: number }>({
            query: ({ catalogId, offset = 0 }) => `/api/catalog/${catalogId}?offset=${offset}`,
            providesTags: ["Product"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newItems) => {
                currentCache.products.push(...newItems.products)
                currentCache.hasMore = newItems.hasMore
                currentCache.nextOffset = newItems.nextOffset
            },
            forceRefetch: ({ currentArg, previousArg }) => currentArg?.catalogId !== previousArg?.catalogId ||
                currentArg?.offset !== previousArg?.offset
        }),


        postOrderOne: builder.mutation<Order, { productId: number, newOrder: Order }>({
            query: ({ productId, newOrder }) => ({
                url: `/api/order/${productId}`,
                method: "POST",
                body: newOrder
            }),
            invalidatesTags: ["Order"]
        }),


        postCart: builder.mutation<PostCart, { newCart: PostCart }>({
            query: ({ newCart }) => ({
                url: `/api/cart/`,
                method: "POST",
                body: newCart,
                credentials: "include"
            }),
            invalidatesTags: ["Cart"]
        }),
        // getCart: builder.query<Cart, number | void>({
        //     query: () => ({
        //         url: "/api/cart",
        //         credentials: "include"
        //     }),
        //     providesTags: ["Cart"],
        // })
    })
})

export const {

    useLazyGetProductsQuery,
    useGetOneProductsQuery,

    usePostRatingMutation,
    useGetRatingQuery,
    useDeleteRatingMutation,
    useUpdateRatingMutation,

    usePostOrderOneMutation,

    useGetCatalogQuery,
    useLazyGetProductsCatalogQuery,

    usePostCartMutation,
    // useGetCartQuery,
} = apiSlice