"use client"

import { Container } from './container'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Home, Menu, Phone, ShoppingCart, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { SearchInput } from './search-input'

interface Props {
    className?: string
}

export const Header = ({ className }: Props) => {
    const pathname = usePathname()

    const isRelativePage = pathname.startsWith("/auth") ||
        pathname.startsWith("/forever")

    return (
        <header className={cn(
            "z-50 bg-[#FAFAFA]",
            isRelativePage
                ? "relative"
                : "sm:sticky sm:top-0 sticky bottom-0",
            className
        )}>
            <Container className={"flex justify-between items-center sm:py-5 py-3"}>
                <nav className={"flex justify-between items-center w-full lg:w-120 font-medium"}>
                    <Link href={"/"} className={"lg:block hidden"}>
                        <Image src="/logo.svg" alt="logo" width={100} height={95} />
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", pathname === "/" && "text-[#007AFF]")} href={"/"}>
                        <div className={"flex items-center flex-col text-[12px] sm:text-[16px]"}>
                            <Home className={"lg:hidden block"} />
                            <span>Главная</span>
                            <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", pathname === "/" && "w-full")} />
                        </div>
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", pathname === "/shop" && "text-[#007AFF]")} href={"/shop"}>
                        <div className={"flex items-center flex-col text-[12px] sm:text-[16px]"}>
                            <Store className={"lg:hidden block"} />
                            <span>Магазин</span>
                            <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", pathname === "/shop" && "w-full")} />
                        </div>
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", pathname === "/contacts" && "text-[#007AFF]")} href={"/contacts"}>
                        <div className={"flex items-center flex-col text-[12px] sm:text-[16px]"}>
                            <Phone className={"lg:hidden block"} />
                            <span>Контакты</span>
                            <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", pathname === "/contacts" && "w-full")} />
                        </div>
                    </Link>

                    <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", (pathname === "/catalog" || pathname.startsWith("/catalog-products")) && "text-[#007AFF]")} href={"/catalog"}>
                        <div className={"flex items-center flex-col text-[12px] sm:text-[16px]"}>
                            <Menu className={"lg:hidden block"} />
                            <span>Каталог</span>
                            <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", (pathname === "/catalog" || pathname.startsWith("/catalog-products")) && "w-full")} />
                        </div>
                    </Link>

                    <div className={"block lg:hidden"}>
                        <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", (pathname === "/favorite") && "text-[#007AFF]")} href={"/favorite"}>
                            <div className={"flex items-center flex-col text-[12px] sm:text-[16px]"}>
                                <Heart className={"lg:hidden block"} />
                                <span>Избранное</span>
                                <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", (pathname === "/favorite") && "w-full")} />
                            </div>
                        </Link>
                    </div>

                    <div className={"block lg:hidden"}>
                        <Link className={cn("relative inline-block group hover:text-[#007AFF] duration-150", (pathname === "/cart") && "text-[#007AFF]")} href={"/cart"}>
                            <div className={"flex items-center flex-col text-[12px] sm:text-[16px]"}>
                                <ShoppingCart className={"lg:hidden block"} />
                                <span>Корзина</span>
                                <span className={cn("absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full", (pathname === "/cart") && "w-full")} />
                            </div>
                        </Link>
                    </div>
                </nav>
                <div className={"lg:block hidden"}>
                    <div className={"flex justify-between items-center w-82"}>
                        <SearchInput className={""} />
                        <Link href={"/cart"}>
                            <ShoppingCart className={"cursor-pointer"} width={24} height={24} />
                        </Link>
                        <Link href={"/favorite"}>
                            <Heart className={"cursor-pointer"} width={24} height={24} />
                        </Link>
                    </div>
                </div>
            </Container>
            <div className={"bg-[#E5E8EB] h-[1px]"} />
        </header>
    )
}