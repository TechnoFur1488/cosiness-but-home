import { Skeleton } from "../ui/skeleton"

export const RatingLoading = () => {
    return (
        <div className={"my-20"}>
            <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-53 h-6"} />
            <div className={"flex justify-between items-center my-3"}>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] h-[241px] w-[467px]"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] h-[241px] w-[467px]"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] h-[241px] w-[467px]"} />
            </div>
            <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[313px] h-[39px]"} />
        </div>
    )
}