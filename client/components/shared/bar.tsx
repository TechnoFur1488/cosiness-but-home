import { cn } from '@/lib/utils'
import { useGetCatalogQuery } from '@/store/apiSlice'
import Link from 'next/link'
import React from 'react'

interface Props {
    className?: string,
    isOpen: boolean
    isSetBar: React.Dispatch<React.SetStateAction<boolean>>
}

interface Catalog {
    id: number
    name: string
}

export const Bar: React.FC<Props> = ({ className, isOpen, isSetBar }) => {

    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <h1>Загрузка</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Каталогов нету</h1>

    return (
        <div className={cn("fixed left-0 top-0 h-full w-[300px] bg-[#F8F8F8] shadow-xl z-40", "transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "-translate-x-full", className)}>
            <div className={"mt-40 max-w-[280px] m-auto"}>
                {data?.catalogs?.map((el: Catalog) => {
                    return (
                        <Link onClick={() => isSetBar(false)} key={el.id} href={`/catalog-products/${el.id}`}>
                            <div className='w-full h-10 p-2 mb-4 rounded-2xl bg-[#E5E5E5] hover:bg-[#DBDBDB] transition duration-300'>
                                {el.name}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}