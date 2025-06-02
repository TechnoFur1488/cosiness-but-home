import { Skeleton } from "../ui/skeleton"

export const RatingMyLoading = () => {
    return (
        <div className={"space-y-3"}>
            <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[30%] h-[27px]"} />
            <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-24"} />
        </div>
    )
}