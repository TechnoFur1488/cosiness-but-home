import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import React, { useEffect } from 'react'

interface Props {
    className?: string
    children: React.ReactNode
    isBigImg: boolean
    isSetBigImg: React.Dispatch<React.SetStateAction<boolean>>
}


export const BigImg: React.FC<Props> = ({ children, className, isBigImg, isSetBigImg }) => {

    useEffect(() => {
        if (isBigImg) {
            const width = window.innerWidth - document.documentElement.clientWidth

            document.body.style.overflow = "hidden"
            document.body.style.paddingRight = `${width}px`
        } else {
            document.body.style.overflow = "auto"
            document.body.style.paddingRight = ""
        }

        return () => {
            document.body.style.overflow = "auto"
            document.body.style.paddingRight = ""
        }
    }, [isBigImg])

    return (
        <div className={cn("", className)} >
            <button onClick={() => isSetBigImg(false)}><X className='text-white cursor-pointer z-[195] absolute right-5 top-5' width={30} height={30} /></button>
            <div className='z-[190] absolute flex justify-center w-full top-0'>
                {children}
            </div>
            <div className='w-full h-screen opacity-50 bg-black absolute top-0 z-[140]' />
        </div>
    )
}