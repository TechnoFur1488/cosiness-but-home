import { Skeleton } from "../ui/skeleton"

export const MiniNewProductLoading = () => {
    let skeletonLoading = []

    for (let i = 0; i < 4; i++) {
        skeletonLoading.push(
            <div key={i} className={"flex justify-between flex-col h-114 rounded-2xl bg-white shadow p-2"}>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[225px] h-[300px]"} />
                <div className={"space-y-2 mt-2"}>
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[70%] h-6 my-[13px]"} />
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[30%] h-6"} />
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[50%] h-5 my-[9px]"} />
                </div>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-8"} />
            </div>
        )
    }

    return (
        <div className={"flex justify-between items-center min-w-250"}>
            {skeletonLoading}
        </div>
    )
}