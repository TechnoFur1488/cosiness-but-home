import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
    dataCatalog?: any
    setEditCatalogId: React.Dispatch<React.SetStateAction<number>>
    editCatalogId: number
    isLoading: boolean
    isError: boolean
}

export const ProductSelectCatalog = ({ dataCatalog, setEditCatalogId, editCatalogId, isLoading, isError }: Props) => {

    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error</p>

    return (
        <Select value={String(editCatalogId)} onValueChange={(value) => setEditCatalogId(Number(value))}>
            <SelectTrigger className='w-full mt-3'>
                <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
                {dataCatalog.map((el: any, i: number) => {
                    return (
                        <SelectItem value={String(el.id)} key={i}>{el.name}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
