"use client"

import { Container } from './container'
import { Input } from '../ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export const Header = () => {
    const pathname = usePathname()

    return (
        <header className={cn("z-50 bg-[#FAFAFA]", pathname === "/" ? "sticky top-0" : pathname.startsWith("/auth") || pathname.startsWith("/product/") || pathname.startsWith("/cart") || pathname.startsWith("/forever") ? "relative" : "sticky top-0")}>
            <Container className={"flex justify-between items-center py-5"}>
                <nav className={"flex justify-between items-center w-120 font-medium"}>
                    <Link href={"/"}>
                        <Image src="/logo.svg" alt="logo" width={100} height={95} />
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", pathname === "/" && "text-[#007AFF]")} href={"/"}>
                        <span>Главная</span>
                        <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", pathname === "/" && "w-full")} />
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", pathname === "/shop" && "text-[#007AFF]")} href={"/shop"}>
                        <span>Магазин</span>
                        <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", pathname === "/shop" && "w-full")} />
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", pathname === "/contacts" && "text-[#007AFF]")} href={"/contacts"}>
                        <span>Контакты</span>
                        <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", pathname === "/contacts" && "w-full")} />
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", (pathname === "/catalog" || pathname.startsWith("/catalog-products")) && "text-[#007AFF]")} href={"/catalog"}>
                        <span>Каталог</span>
                        <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", (pathname === "/catalog" || pathname.startsWith("/catalog-products")) && "w-full")} />
                    </Link>
                </nav>
                <div className={"flex justify-between items-center w-82"}>
                    <div className={"relative"}>
                        <Search width={24} height={24} className={"absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]"} />
                        <Input type='text' placeholder='Поиск' className={"pl-12 text-black"} />
                    </div>
                    <Link href={"/cart"}>
                        <ShoppingCart className={"cursor-pointer"} width={24} height={24} />
                    </Link>
                    <Link href={"/favorite"}>
                        <Heart className={"cursor-pointer"} width={24} height={24} />
                    </Link>
                </div>
            </Container>
            <div className={"bg-[#E5E8EB] h-[1px]"} />
        </header>
    )
}