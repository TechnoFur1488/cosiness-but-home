import { cn } from '@/lib/utils'
import React, { PropsWithChildren } from 'react'

interface Props {
    className?: string
}

export const Container = ({ className, children }: PropsWithChildren<Props>) => {
    return (
        <div className={cn("max-w-[358px] sm:max-w-[744px] md:max-w-[940px] lg:max-w-[1140px] xl:max-w-[1440px] m-auto sm:px-6 lg:px-0", className)}>
            {children}
        </div>
    )
}