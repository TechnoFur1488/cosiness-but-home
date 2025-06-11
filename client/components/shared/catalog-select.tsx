import { useGetCatalogQuery } from "@/store/apiSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface CatalogSelectProps {
    value?: string
    onChange?: (value: string) => void
}

export const CatalogSelect = ({ value, onChange }: CatalogSelectProps) => {
    const { data, isLoading, isError } = useGetCatalogQuery()

    if (isLoading) return <h1>Загрузка</h1>
    if (isError) return <h1>Ошибка</h1>

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={"w-full"}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {data?.catalogs.map((el: any) => (
                    <SelectItem value={String(el.id)} key={el.id}>{el.name}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}