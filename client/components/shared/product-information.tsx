import { ModalInformation } from './modal-information'
import { ProductSelectSize } from './product-select-size'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { ProductBuy } from './product-buy'
import { ParamValue } from 'next/dist/server/request/params'

interface Props {
    isName: string
    isCompound: string
    isWarp: string
    isHight: number
    isHardness: number
    isSize: string[]
    isDescription: string
    isFrom: string
    isPrice: number
    isDiscount: number
    isSelectedSize: string
    isProductId: ParamValue

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

    editPrice: number
    setEditPrice: React.Dispatch<React.SetStateAction<number>>

    editDiscount: number
    setEditDiscount: React.Dispatch<React.SetStateAction<number>>

    setEditCatalogId: React.Dispatch<React.SetStateAction<number>>
    editCatalogId: number
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
    isDiscount,
    isPrice,
    isSelectedSize,
    isProductId,

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

    selectSize,

    editPrice,
    setEditPrice,

    editDiscount,
    setEditDiscount,

    editCatalogId,
    setEditCatalogId
}: Props) => {
    let description: string = isDescription

    if (description.length > 150) {
        description = description.slice(0, 220) + "... "
    }

    return (
        <>
            {isEdit
                ?
                <div className={"flex flex-col justify-between my-0 space-y-3"}>
                    <Input className={"h-[33px] font-bold text-[22px]"} type='text' value={editName} onChange={e => setEditName(e.target.value)} />
                    <Textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                    <h2 className={"font-bold text-[18px]"}>Выбрать размер</h2>
                    <Textarea value={editSize} onChange={e => setEditSize(e.target.value)} />
                    <h2 className={"font-bold text-[18px]"}>Цена</h2>
                    <ProductBuy
                        isEdit={isEdit}
                        isPrice={isPrice}
                        isDiscount={isDiscount}
                        isSize={isSize}
                        isSelectedSize={isSelectedSize}
                        isProductId={isProductId}

                        editPrice={editPrice}
                        setEditPrice={setEditPrice}

                        editDiscount={editDiscount}
                        setEditDiscount={setEditDiscount}

                        editCatalogId={editCatalogId}
                        setEditCatalogId={setEditCatalogId}
                    />
                    <h2 className={"font-bold text-[18px]"}>Информация о товаре</h2>
                    <div className={"text-sm font-light"}>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-4"} />
                        <div className={"flex justify-between mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={" text-[#737373]"}>Состав:</span>
                                <Input className={"w-100"} type='text' value={editCompound} onChange={e => setEditCompound(e.target.value)} />
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Основа</span>
                                <Input className={"w-100"} type='text' value={editWarp} onChange={e => setEditWarp(e.target.value)} />
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-4"} />
                        <div className={"flex justify-between mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Высота ворса</span>
                                <Input className={"w-100"} type="number" value={editHight} onChange={e => setEditHight(Number(e.target.value))} />мм
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Плотность</span>
                                <Input className={"w-100"} type='number' value={editHardness} onChange={e => setEditHardness(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-4"} />
                        <div className={"flex justify-between mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Производитель</span>
                                <Input className={"w-100"} type='text' value={editFrom} onChange={e => setEditFrom(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className={"mt-9 space-y-3"}>
                    <h1 className={"text-[22px] font-bold"}>{isName}</h1>
                    <p className={"font-light"}>
                        {description}
                        <ModalInformation>
                            {isDescription}
                        </ModalInformation>
                    </p>
                    <h2 className={"font-bold text-[18px]"}>Выбрать размер</h2>
                    <ProductSelectSize selectSize={selectSize} isSize={isSize} />
                    <h2 className={"font-bold text-[18px]"}>Цена</h2>
                    <ProductBuy
                        isEdit={isEdit}
                        isPrice={isPrice}
                        isDiscount={isDiscount}
                        isSize={isSize}
                        isSelectedSize={isSelectedSize}
                        isProductId={isProductId}

                        editPrice={editPrice}
                        setEditPrice={setEditPrice}

                        editDiscount={editDiscount}
                        setEditDiscount={setEditDiscount}

                        editCatalogId={editCatalogId}
                        setEditCatalogId={setEditCatalogId}
                    />
                    <h2 className={"font-bold text-[18px]"}>Информация о товаре</h2>
                    <div className={"text-sm font-light"}>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-4"} />
                        <div className={"flex justify-between mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Состав</span>
                                <span>{isCompound}</span>
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Основа</span>
                                <span>{isWarp}</span>
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-4"} />
                        <div className={"flex justify-between mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Высота ворса</span>
                                <span>{isHight} мм</span>
                            </div>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Плотность</span>
                                <span>{isHardness.toLocaleString("ru-RU")}</span>
                            </div>
                        </div>
                        <div className={"bg-[#E5E8EB] h-[1px] mb-4"} />
                        <div className={"flex justify-between mb-5"}>
                            <div className={"w-[50%] flex flex-col items-start"}>
                                <span className={"text-[#737373]"}>Производитель</span>
                                <span>{isFrom}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}