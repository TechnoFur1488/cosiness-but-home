import { Skeleton } from "../ui/skeleton"

export const RatingStatisticsLoading = () => {
    return (
        <div className={"w-[50%] flex items-center"}>
            <div className={"space-y-2"}>
                <Skeleton className={"w-20 h-10 rounded-2xl bg-[#E5E5EA]"} />
                <Skeleton className={"w-30 h-6 rounded-2xl bg-[#E5E5EA]"} />
                <Skeleton className={"w-25 h-6 rounded-2xl bg-[#E5E5EA]"} />
            </div>
            <div className={"space-y-2 ml-3"}>
                <div className={"flex items-center space-x-3"}>
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[248px] h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                </div>
                <div className={"flex items-center space-x-3"}>
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[248px] h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                </div>
                <div className={"flex items-center space-x-3"}>
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[248px] h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                </div>
                <div className={"flex items-center space-x-3"}>
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[248px] h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                </div>
                <div className={"flex items-center space-x-3"}>
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[248px] h-3 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-3 h-3 rounded-2xl bg-[#E5E5EA]"} />
                </div>
            </div>
        </div>
    )
}