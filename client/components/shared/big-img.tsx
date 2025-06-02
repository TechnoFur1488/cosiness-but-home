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
            <button onClick={() => isSetBigImg(false)}><X className='text-white cursor-pointer z-[195] absolute right-5 top-5' width={30} height={30} /></button>
            <div className='z-[190] absolute inset-0 flex items-center justify-center'>
                {children}
            </div>
            <div className='w-full h-screen opacity-50 bg-black absolute top-0 z-[140]' />
        </div>
    )
}