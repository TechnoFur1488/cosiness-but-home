import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
    dataCatalog?: any
    setEditCatalogId: React.Dispatch<React.SetStateAction<string>>
    editCatalogId: string
}

export const ProductSelectCatalog = ({ dataCatalog, setEditCatalogId, editCatalogId }: Props) => {

    return (
        <Select value={editCatalogId} onValueChange={(value) => setEditCatalogId(value)}>
            <SelectTrigger className={"w-[467px]"}>
                <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
                {dataCatalog.map((el: any, i: number) => {
                    return (
                        <SelectItem value={el.id} key={i}>{el.name}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}
