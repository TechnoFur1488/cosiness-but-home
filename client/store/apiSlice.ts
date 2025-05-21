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
    from: string
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
    id: number
    mail: string
    name: string
    adress: string
    phone: string
    delivery: string
    pay: string
    size: string
    quantity: number
    policy: boolean
    total: number
    createdAt: string
    order_items: [
        {
            id: number
            quantity: number
            price: number
            productName: string
            size: string
            productId: number
        }
    ]
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

interface Cart {
    id: number
    size: Array<string>
    quantity: number
    total: number
    productId: number
    product: {
        name: string
        img: Array<string>
    }
}

interface PostForever {
    productId: number
}

interface Forever {
    id: number
    product: {
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
}

interface Auth {
    name: string
    email: string
    password: string
    token: string
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
    tagTypes: ["Product", "Rating", "Order", "Catalog", "Cart", "Forever", "User"],
    endpoints: (builder) => ({

        createProduct: builder.mutation<Products, FormData>({
            query: (formData) => ({
                url: "/api/products/",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Product"]
        }),
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
        updateProduct: builder.mutation<Products, FormData>({
            query: (formData) => ({
                url: `/api/products/${formData.get("id")}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Product"]
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Product"]
        }),
        getOneProducts: builder.query<{ product: Products }, number | void>({
            query: (id) => `/api/products/${id}`,
            providesTags: ["Product"]
        }),

        registration: builder.mutation<Auth, Partial<Auth>>({
            query: (user) => ({
                url: "/api/user/registration",
                method: "POST",
                body: user
            }),
            invalidatesTags: ["User"]
        }),
        login: builder.mutation<Auth, Partial<Auth>>({
            query: (user) => ({
                url: "/api/user/login",
                method: "POST",
                body: user
            }),
            invalidatesTags: ["User"]
        }),
        // myCookie:builder.query<

        getRating: builder.query<{ rating: Rating[] }, number>({
            query: (productId) => `/api/rating/${productId}`,
            providesTags: ["Rating"]
        }),
        getMyRating: builder.query<{ myRating: Rating }, number>({
            query: (productId) => ({
                url: `/api/rating/${productId}/my-rating`,
                credentials: "include"  
            }),
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


        postOrderOne: builder.mutation<Order, { productId: number, newOrder: Partial<Order> }>({
            query: ({ productId, newOrder }) => ({
                url: `/api/order/${productId}`,
                method: "POST",
                body: newOrder
            }),
            invalidatesTags: ["Order"]
        }),
        postOrder: builder.mutation<Order, { newOrder: Partial<Order> }>({
            query: ({ newOrder }) => ({
                url: "/api/order/",
                method: "POST",
                body: newOrder,
                credentials: "include"
            }),
            invalidatesTags: ["Order"]
        }),
        getOrder: builder.query<{ allOrderItems: { rows: Order[] } }, void>({
            query: () => "/api/order",
            providesTags: ["Order"]
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
        getCart: builder.query<{ cartItem: Cart[] }, void>({
            query: () => ({
                url: "/api/cart",
                credentials: "include"
            }),
            providesTags: ["Cart"],
        }),
        deleteCart: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/cart/${id}`,
                method: "DELETE",
                credentials: "include"
            }),
            invalidatesTags: ["Cart"]
        }),


        postForever: builder.mutation<PostForever, number>({
            query: (productId) => ({
                url: `/api/forever/${productId}`,
                method: "POST",
                credentials: "include"
            }),
            invalidatesTags: ["Forever"]
        }),
        getForever: builder.query<{ foreverItem: Forever[] }, void>({
            query: () => ({
                url: "/api/forever",
                credentials: "include"
            }),
            providesTags: ["Forever"]
        }),
        deleteForever: builder.mutation<void, number>({
            query: (productId) => ({
                url: `/api/forever/${productId}`,
                method: "DELETE",
                credentials: "include"
            }),
            invalidatesTags: ["Forever"]
        })
    })
})

export const {
    useCreateProductMutation,
    useLazyGetProductsQuery,
    useGetOneProductsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,

    useLoginMutation,
    useRegistrationMutation,

    usePostRatingMutation,
    useGetMyRatingQuery,
    useGetRatingQuery,
    useDeleteRatingMutation,
    useUpdateRatingMutation,

    usePostOrderOneMutation,
    usePostOrderMutation,
    useGetOrderQuery,

    useGetCatalogQuery,
    useLazyGetProductsCatalogQuery,

    usePostCartMutation,
    useGetCartQuery,
    useDeleteCartMutation,

    usePostForeverMutation,
    useGetForeverQuery,
    useDeleteForeverMutation,
} = apiSlice