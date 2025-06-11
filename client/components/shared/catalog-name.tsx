"use client"

import { useGetOneCatalogQuery } from "@/store/apiSlice"
import { Skeleton } from "../ui/skeleton"

interface Props {
    catalogId: number
}

export const CatalogName = ({ catalogId }: Props) => {
    const { data, isLoading, isError } = useGetOneCatalogQuery(catalogId)

    if (isLoading) return <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[20%] h-12 mb-7"} />
    if (isError) return <h1>Ошибка</h1>

    return (
        <h1 className={"font-bold text-[32px] mb-7"}>{data?.catalog.name}</h1>
    )
}