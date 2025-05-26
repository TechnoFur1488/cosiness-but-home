import { useState } from "react"
import { Skeleton } from "../ui/skeleton"
import { HiddenScrol } from "../utils"

export const ProductLoading = () => {
    const [scrol, setScrol] = useState(false)

    HiddenScrol(scrol)

    let skeletonLoading = []
    for (let i = 0; i < 8; i++) {
        skeletonLoading.push(
            <div key={i} className={"flex justify-between flex-col"}>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[345px] h-[430px]"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[70%] h-6 my-[13px]"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[30%] h-6"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[50%] h-5 my-[9px]"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[345px] h-[46px]"} />
            </div>
        )
    }

    return (
        <div className={"grid grid-cols-4 gap-x-5 gap-y-10 my-20"}>
            {skeletonLoading}
        </div>
    )
}