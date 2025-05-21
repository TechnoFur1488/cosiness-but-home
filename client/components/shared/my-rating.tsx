import { Trash } from "lucide-react"
import { UpdateRating } from "./update-rating"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Props {
    isLoading: boolean
    isError: boolean
    isMyRating: any
    isDateMyRating: (date: string) => string
    isHandleDelete: (id: number) => void
    isMaxLengthText: (text: string) => string | undefined
}

export const MyRating = ({ 
    isLoading, 
    isError, 
    isMyRating, 
    isDateMyRating, 
    isHandleDelete,
    isMaxLengthText
}: Props) => {

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>

    return (
        <>  
            <h1>Ваш отзыв</h1>
            <div className={"flex flex-col bg-[#F8F8F8] max-w-[467px] min-h-[241px] p-3 rounded-2xl space-y-2 "}>
                <div className={'w-full flex justify-between items-center'}>
                    <span className={"text-[18px]"}>{isMyRating.name}</span>
                    <div>{isMyRating.grade}</div>
                </div>
                <div className={'flex justify-between'}>
                    <div>
                        <button className={'cursor-pointer'} onClick={() => isHandleDelete(isMyRating.id)}><Trash className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} /></button>
                        <UpdateRating isName={isMyRating.name} isGrade={isMyRating.grade} isGradeText={isMyRating.gradeText} isId={isMyRating.id} />
                    </div>
                    <span className={'text-[13px]'}>{isDateMyRating(isMyRating.createdAt)}</span>
                </div>
                <div className={'flex justify-between items-start cursor-pointer'}>
                    <p className={"w-65"}>{isMaxLengthText(isMyRating.gradeText)}</p>
                    <div className={"relative w-38 h-25"}>
                        {isMyRating.img.slice(0, 3).map((el: string, i: number) => (
                            <div key={i} className={cn(
                                "absolute top-0 w-[110px] h-[150px] rounded-md border-2 border-white transition-all",
                                "shadow-md overflow-hidden",
                                {
                                    "left-0 z-30": i === 0,
                                    "left-6 z-20": i === 1,
                                    "left-12 z-10": i === 2,
                                }
                            )}
                            >
                                <Image src={el} alt={el} fill sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}