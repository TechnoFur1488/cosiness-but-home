import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface Products {
    id: number
    img: string[]
    name: string
    price: number
    discount: number
    compound: string
    warp: string
    hight: number
    hardness: number
    size: string[]
    description: string
    from: string
    catalogId: number
    existingImg: string[]
}

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: string[]
    productId: number
    createdAt: string
}

interface RatingResponse {
    ratings: Rating[]
    hasMore: boolean
    nextOffset: number
}

interface PostRating {
    name: string
    grade: number
    gradeText?: string
    img?: string[]
}

interface ProductsResponse {
    products: Products[]
    hasMore: boolean
    nextOffset: number
}

interface ProductSearch {
    products: Products[]
    hasMore: boolean
    nextOffset: number
    total: number
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
    img: string[]
}

interface PostCart {
    size: string
    quantity: number
    productId: number
}

interface Cart {
    id: number
    size: string
    quantity: number
    total: number
    totalDiscount: number
    productId: number
    product: {
        name: string
        img: Array<string>
        size: string[]
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
        baseUrl: "http://192.168.0.111:5000",
        prepareHeaders: (headers, { getState }) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem("token")
                if (token) {
                    headers.set("authorization", `Bearer ${token}`)
                }
            }
            return headers
        }
    }),
    tagTypes: ["Product", "Rating", "Order", "Catalog", "Cart", "Forever", "User", "Search"],
    endpoints: (builder) => ({

        createProduct: builder.mutation<Products, FormData>({
            query: (formData) => ({
                url: "/api/products/",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Product"]
        }),
        getProducts: builder.query<ProductsResponse, { offset: number }>({
            query: ({ offset = 0 }) => `/api/products?offset=${offset}`,
            providesTags: ["Product"],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.offset === 0) {
                    return newItems
                }
                return {
                    products: [...currentCache.products, ...newItems.products],
                    hasMore: newItems.hasMore,
                    nextOffset: newItems.nextOffset
                }
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg !== previousArg
            }
        }),
        getNewProduct: builder.query<{ products: Products[] }, void>({
            query: () => "/api/products/new-products",
            providesTags: ["Product"]
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


        getRating: builder.query<{ rating: Rating[] }, number>({
            query: (productId) => `/api/rating/${productId}`,
            providesTags: ["Rating"]
        }),
        getAllRating: builder.query<{ rating: Rating[], hasMore: boolean, nextOffset: number }, { offset: number }>({
            query: ({ offset = 0 }) => `/api/rating?offset=${offset}`,
            providesTags: ["Rating"],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.offset === 0) {
                    return newItems
                }
                return {
                    rating: [...currentCache.rating, ...newItems.rating],
                    hasMore: newItems.hasMore,
                    nextOffset: newItems.nextOffset
                }
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg !== previousArg
            }
        }),
        getRatingLazy: builder.query<RatingResponse, { productId: number, offset: number }>({
            query: ({ productId, offset = 0 }) => `/api/rating/${productId}/lazy-rating?offset=${offset}`,
            providesTags: ["Rating"],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.offset === 0) {
                    return newItems
                }
                return {
                    ratings: [...currentCache.ratings, ...newItems.ratings],
                    hasMore: newItems.hasMore,
                    nextOffset: newItems.nextOffset
                }
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg !== previousArg
            }
        }),
        getMyRating: builder.query<{ myRating: Rating }, number>({
            query: (productId) => ({
                url: `/api/rating/${productId}/my-rating`,
                credentials: "include"
            }),
            providesTags: ["Rating"]
        }),
        getOneRating: builder.query<{ rating: Rating }, number>({
            query: (id) => `/api/rating/one-rating/${id}`,
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
        getOneCatalog: builder.query<{ catalog: Catalog }, number>({
            query: (id) => `/api/catalog/one-catalog/${id}`,
            providesTags: ["Catalog"]
        }),
        getProductsCatalog: builder.query<ProductsResponse, { catalogId: number, offset: number }>({
            query: ({ catalogId, offset = 0 }) => `api/catalog/${catalogId}?offset=${offset}`,
            providesTags: ["Product"],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.offset === 0) {
                    return newItems
                }
                return {
                    products: [...currentCache.products, ...newItems.products],
                    hasMore: newItems.hasMore,
                    nextOffset: newItems.nextOffset
                }
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg !== previousArg
            }
        }),
        createCatalog: builder.mutation<{ catalog: Catalog }, FormData>({
            query: (formData) => ({
                url: "/api/catalog",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Catalog"]
        }),
        deleteCatalog: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/catalog/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Catalog"]
        }),
        updateCatalog: builder.mutation<{catalogResult: Catalog}, FormData>({
            query: (formData) => ({
                url: `/api/catalog/${formData.get("id")}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Catalog"]
        }),


        getProductsSearch: builder.query<ProductSearch, { offset: number, query: string }>({
            query: ({ offset = 0, query }) => `/api/search?query=${query}&offset=${offset}`,
            providesTags: ["Search"],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.offset === 0) {
                    return newItems
                }
                return {
                    products: [...currentCache.products, ...newItems.products],
                    hasMore: newItems.hasMore,
                    nextOffset: newItems.nextOffset,
                    total: newItems.total
                }
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg !== previousArg
            }
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
        updateCart: builder.mutation<void, { quantity: number, id: number }>({
            query: ({ id, quantity }) => ({
                url: `/api/cart/${id}`,
                method: "PUT",
                body: { quantity },
                credentials: "include"
            }),
            invalidatesTags: ["Cart"]
        }),
        deleteCart: builder.mutation<Cart, number>({
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
    useGetNewProductQuery,
    useGetOneProductsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,

    useLazyGetProductsSearchQuery,

    useLoginMutation,
    useRegistrationMutation,

    usePostRatingMutation,
    useLazyGetAllRatingQuery,
    useGetMyRatingQuery,
    useGetOneRatingQuery,
    useGetRatingQuery,
    useLazyGetRatingLazyQuery,
    useDeleteRatingMutation,
    useUpdateRatingMutation,

    usePostOrderOneMutation,
    usePostOrderMutation,
    useGetOrderQuery,

    useGetCatalogQuery,
    useGetOneCatalogQuery,
    useLazyGetProductsCatalogQuery,
    useCreateCatalogMutation,
    useDeleteCatalogMutation,
    useUpdateCatalogMutation,

    usePostCartMutation,
    useGetCartQuery,
    useUpdateCartMutation,
    useDeleteCartMutation,

    usePostForeverMutation,
    useGetForeverQuery,
    useDeleteForeverMutation,
} = apiSlice