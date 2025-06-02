import { Skeleton } from "../ui/skeleton"

export const MiniCatalogLoading = () => {
    let skeletonLoading = []

    for (let i = 0; i < 4; i++) {
        skeletonLoading.push(
            <div key={i} className={"flex justify-between flex-col h-[252px] rounded-2xl bg-white shadow p-2"}>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[207px] h-[200px] mb-3"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[70%] h-6"} />
            </div>
        )
    }

    return (
        <div className={"flex justify-between items-center min-w-250"}>
            {skeletonLoading}
        </div>
    )
}