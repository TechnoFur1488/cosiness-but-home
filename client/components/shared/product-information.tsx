import { ModalInformation } from './modal-information'
import { ProductSelectSize } from './product-select-size'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface Props {
    isName: string
    isCompound: string
    isWarp: string
    isHight: number
    isHardness: number
    isSize: Array<string>
    isDescription: string
    isFrom: string

    isEdit: boolean

    editName: string
    setEditName: React.Dispatch<React.SetStateAction<string>>

    editCompound: string
    setEditCompound: React.Dispatch<React.SetStateAction<string>>

    editWarp: string
    setEditWarp: React.Dispatch<React.SetStateAction<string>>

    editHight: number
    setEditHight: React.Dispatch<React.SetStateAction<number>>

    editHardness: number
    setEditHardness: React.Dispatch<React.SetStateAction<number>>

    editSize: string
    setEditSize: React.Dispatch<React.SetStateAction<string>>

    editDescription: string
    setEditDescription: React.Dispatch<React.SetStateAction<string>>

    editFrom: string
    setEditFrom: React.Dispatch<React.SetStateAction<string>>

    selectSize: React.Dispatch<React.SetStateAction<string>>
}

export const ProductInformation = ({
    isName,
    isCompound,
    isWarp,
    isHight,
    isHardness,
    isSize,
    isDescription,
    isEdit,
    isFrom,

    editName,
    setEditName,

    editCompound,
    setEditCompound,

    editWarp,
    setEditWarp,

    editHight,
    setEditHight,

    editHardness,
    setEditHardness,

    editSize,
    setEditSize,

    editDescription,
    setEditDescription,

    editFrom,
    setEditFrom,

    selectSize
}: Props) => {
    let description: string = isDescription

    if (description.length > 150) {
        description = description.slice(0, 150) + "..."
    }

    return (
        <>
            {isEdit
                ?
                <div className={"w-[467px] min-h-[692px] flex flex-col justify-between"}>
                    <Input className={"h-15 font-medium text-[40px]"} type='text' value={editName} onChange={e => setEditName(e.target.value)} />
                    <h2 className={"my-[10px] font-medium text-[32px]"}>Характеристики</h2>
                    <div className={"flex h-50 justify-between flex-col"}>
                        <span className={"flex items-center"}>
                            <span className={" text-[#6E6E73]"}>Состав:</span>
                            <Input className={"h-10"} type='text' value={editCompound} onChange={e => setEditCompound(e.target.value)} />
                        </span>
                        <span className={"flex items-center"}>
                            <span className={" text-[#6E6E73]"}>Основа:</span>
                            <Input className={"h-10"} type='text' value={editWarp} onChange={e => setEditWarp(e.target.value)} />
                        </span>
                        <span className={"flex items-center"}>
                            <span className={" text-[#6E6E73]"}>Высота ворса:</span>
                            <Input className={"h-10"} type="number" value={editHight} onChange={e => setEditHight(Number(e.target.value))} />мм
                        </span>
                        <span className={"flex items-center"}>
                            <span className={" text-[#6E6E73]"}>Плотность:</span>
                            <Input className={"h-10"} type='number' value={editHardness} onChange={e => setEditHardness(Number(e.target.value))} />
                        </span>
                        <span className={"flex items-center"}>
                            <span className={" text-[#6E6E73]"}>Производитель:</span>
                            <Input className={"h-10"} type='text' value={editFrom} onChange={e => setEditFrom(e.target.value)} />
                        </span>
                    </div>
                    <h2 className={"my-[10px] text-[32px] font-medium"}>Размеры</h2>
                    <div>
                        <Input type="text" value={editSize} onChange={e => setEditSize(e.target.value)} />
                    </div>
                    <h2 className={"py-[10px] text-[32px] font-medium"}>Описание</h2>
                    <p className={"text-[#6E6E73] "}>
                        <Textarea className='h-20' value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                    </p>
                </div>
                :
                <div className={"w-[467px] flex flex-col justify-between"}>
                    <h1 className={"font-medium text-[40px]"}>{isName}</h1>
                    <h2 className={"py-[10px] font-medium text-[32px]"}>Характеристики</h2>
                    <div className={"flex h-40 justify-between flex-col"}>
                        <span><span className={" text-[#6E6E73]"}>Состав:</span> {isCompound}</span>
                        <span><span className={" text-[#6E6E73]"}>Основа:</span> {isWarp}</span>
                        <span><span className={" text-[#6E6E73]"}>Высота ворса:</span> {isHight} мм</span>
                        <span><span className={" text-[#6E6E73]"}>Плотность:</span> {isHardness.toLocaleString("ru-RU")} </span>
                        <span><span className={" text-[#6E6E73]"}>Производитель:</span> {isFrom} </span>
                    </div>
                    <h2 className={"py-[10px] text-[32px] font-medium"}>Размеры</h2>
                    <div>
                        <ProductSelectSize selectSize={selectSize} isSize={isSize} />
                    </div>
                    <h2 className={"py-[10px] text-[32px] font-medium"}>Описание</h2>
                    <p className={"text-[#6E6E73] "}>
                        {description}
                        <ModalInformation >
                            {isDescription}
                        </ModalInformation>
                    </p>
                </div>
            }
        </>
    )
}