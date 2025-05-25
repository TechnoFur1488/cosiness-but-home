"use client"

import React, { useEffect, useState } from 'react'
import { Container } from './container'
import { Input } from '../ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Menu, ShoppingCart } from 'lucide-react'
import { Bar } from './bar'
import { cn } from '@/lib/utils'

export const Header = () => {

    const [bar, setBar] = useState(false)
    const [scrollbarWidth, setScrollbarWidth] = useState(0)

    useEffect(() => {
        if (bar) {

            const width = window.innerWidth - document.documentElement.clientWidth
            setScrollbarWidth(width)

            document.body.style.overflow = "hidden"
            document.body.style.paddingRight = `${width}px`
            document.body.style.backgroundColor = 'white'
        } else {
            document.body.style.overflow = "auto"
            document.body.style.paddingRight = ""
            document.body.style.backgroundColor = ''
        }

        return () => {
            document.body.style.overflow = "auto"
            document.body.style.paddingRight = ""
            document.body.style.backgroundColor = ''
        }
    }, [bar])

    return (
        <>
            <header className={'py-5 sticky top-0 z-50 bg-white'} style={{ paddingRight: bar ? `${scrollbarWidth}px` : "", marginRight: bar ? `-${scrollbarWidth}px` : "" }}  >
                <Container className='flex items-center justify-between'>
                    <div className='flex justify-between w-[267px]'>
                        <Link href={"/"}>
                            <Image src="/logo.svg" alt="logo" width={141} height={95} />
                        </Link>
                        <button onClick={() => setBar(!bar)} className='cursor-pointer'>
                            <Menu width={37} height={37} fill='currentColor' className='text-[#E5E5EA] hover:text-[#DBDBDB] transition-colors' />
                        </button>
                    </div>
                    <Input className='w-177.5 h-[47px] bg-[#E5E5EA] hover:bg-[#DBDBDB] transition-colors' type='text' placeholder='Поиск' />
                    <div className='flex justify-between w-[191px]'>
                        <Link href={"/cart"}>
                            <ShoppingCart fill='currentColor' className='text-[#E5E5EA] hover:text-[#DBDBDB] transition-colors' width={37} height={37} />
                        </Link>
                        <Link href={"/forever"}>
                            <Heart fill='currentColor' className='text-[#E5E5EA] hover:text-[#DBDBDB] transition-colors' width={37} height={37} />
                        </Link>
                    </div>
                </Container>
            </header>
            <div className={cn( "fixed inset-0 z-40 transition-opacity duration-300", bar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
                <div className={"absolute inset-0 bg-black opacity-50"} onClick={() => setBar(false)} /> 
                <Bar isSetBar={setBar} isOpen={bar} />
            </div>
        </>
    )
}