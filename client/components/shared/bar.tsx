import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

interface Props {
    className?: string,
    isOpen: boolean
}

export const Bar: React.FC<Props> = ({ className, isOpen }) => {
    return (
        <div className={cn("fixed left-0 top-0 h-full w-[300px] bg-[#F8F8F8] shadow-xl z-50", "transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "-translate-x-full", className)}>
            <div className={"mt-40"}>
                <Link className='w-10 bg-black'  href={"/"}>Ковры</Link>
            </div>
        </div>
    )
}