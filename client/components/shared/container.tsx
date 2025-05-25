import { cn } from '@/lib/utils'
import React, { PropsWithChildren } from 'react'

interface Props {
    className?: string
}

export const Container = ({ className, children }: PropsWithChildren<Props>) => {
    return (
        <div className={cn("max-w-[1440px] m-auto", className)}>
            {children}
        </div>
    )
}