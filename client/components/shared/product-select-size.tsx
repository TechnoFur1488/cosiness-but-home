import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface Props {
    isSize: string[]
    selectSize: React.Dispatch<React.SetStateAction<string>>
}

export const ProductSelectSize = ({ isSize, selectSize }: Props) => {
    return (
        <Select onValueChange={(value) => selectSize(value)}>
            <SelectTrigger className={"w-[467px]"}>
                <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
                {isSize.map((el, i) => {
                    return (
                        <SelectItem value={el} key={i}>{el}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}