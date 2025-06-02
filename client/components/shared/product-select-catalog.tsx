import { useGetCatalogQuery } from '@/store/apiSlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
    setEditCatalogId: React.Dispatch<React.SetStateAction<number>>
    editCatalogId: number
}

export const ProductSelectCatalog = ({setEditCatalogId, editCatalogId }: Props) => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error</p>

    return (
        <Select value={String(editCatalogId)} onValueChange={(value) => setEditCatalogId(Number(value))}>
            <SelectTrigger className='w-full mt-3'>
                <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
                {data?.catalogs.map((el: any, i: number) => {
                    return (
                        <SelectItem value={String(el.id)} key={i}>{el.name}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
