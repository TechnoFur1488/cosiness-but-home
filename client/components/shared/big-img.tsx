import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { HiddenScrol } from '../utils/hidden-scrol'

interface Props {
    className?: string
    children: React.ReactNode
    isBigImg: boolean
    isSetBigImg: React.Dispatch<React.SetStateAction<boolean>>
}

export const BigImg = ({ children, className, isBigImg, isSetBigImg }: Props) => {
    HiddenScrol(isBigImg)

    return (
        <div className={cn("relative", className)} >
            <button 
                onClick={() => isSetBigImg(false)}
                className="absolute right-3 top-3 lg:right-5 lg:top-5 z-[195]"
            >
                <X className='text-white cursor-pointer w-5 h-5 lg:w-8 lg:h-8' />
            </button>
            <div className='z-[190] absolute inset-0 flex items-center justify-center p-4 lg:p-0 '>
                {children}
            </div>
            <div className='w-full h-screen opacity-50 bg-black absolute top-0 z-[140]' />
        </div>
    )
}