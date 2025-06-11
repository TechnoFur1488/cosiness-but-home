"use client"

import { useState, KeyboardEvent } from "react"
import { Input } from "../ui/input"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    className?: string
}

export const SearchInput = ({ className }: Props) => {
    const [search, setSearch] = useState("")
    const router = useRouter()

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim().length >= 2) {
            router.push(`/search?query=${encodeURIComponent(search.trim())}`)
        }
    }

    const handleClick = () => {
        if (search.trim().length >= 2) {
            router.push(`/search?query=${encodeURIComponent(search.trim())}`)
        }
    }

    return (
        <div className={cn("relative", className)}>
            <Search onClick={handleClick} width={24} height={24} className={"absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] cursor-pointer"} />
            <Input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск" onKeyDown={handleKeyDown} className={"pl-12 text-black h-10 rounded-2xl bg-white"} />
        </div>
    )
}