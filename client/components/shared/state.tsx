
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import React from 'react'

interface Props {
    className?: string
    isSiccess: boolean
    isSetSiccess: React.Dispatch<React.SetStateAction<boolean>>
    isBad: boolean
    isSetBad: React.Dispatch<React.SetStateAction<boolean>>
}

export const Successfully: React.FC<Props> = ({ className, isSiccess, isSetSiccess, isBad, isSetBad }) => {

    return (
        <>
            {isBad &&
                <div className={cn("fixed bottom-4 right-4 z-100 ", className)}>
                    <div className="w-100 h-25 rounded-2xl bg-red-200 opacity-90 border-red-800 border-4 relative  ">
                        <div className="absolute right-1 top-1">
                            <button onClick={() => isSetBad(false)} className="cursor-pointer w-[20px] h-[20px] rounded-3xl "><X className='text-red-800 hover:text-red-600 transition-colors' width={20} height={20} /></button>
                        </div>
                        <div className="w-full h-full flex justify-center items-center text-1xl">
                            <h3>Произошла ошибка</h3>
                        </div>
                        <div className="w-full left-2 right-2 bottom-2 h-1 absolute border-1 rounded-2xl border-red-800 bg-black animate-shrink" />
                    </div>
                </div>
            }
            {isSiccess &&
                <div className={cn("fixed bottom-4 right-4 z-100 ", className)}>
                    <div className="w-100 h-25 rounded-2xl bg-green-200 opacity-50 border-green-800 border-4 relative  ">
                        <div className="absolute right-1 top-1">
                            <button onClick={() => isSetSiccess(false)} className="cursor-pointer w-[20px] h-[20px] rounded-3xl "><X className='text-green-800 hover:text-green-600 transition-colors' width={20} height={20} /></button>
                        </div>
                        <div className="w-full h-full flex justify-center items-center text-1xl">
                            <h3>Заказ успешно отправлен</h3>
                        </div>
                        <div className="w-full left-2 right-2 bottom-2 h-1 absolute border-1 rounded-2xl border-green-800 bg-black animate-shrink" />
                    </div>
                </div>
            }
        </>
    )
}
