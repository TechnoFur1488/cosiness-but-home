import { Skeleton } from "../ui/skeleton"

export const CatalogLoading = () => {
    let skeletonLoading = []

    for (let i = 0; i < 8; i++) {
        skeletonLoading.push(
            <div key={i} className={"flex justify-between flex-col h-[252px] rounded-2xl bg-white shadow p-2"}>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-[200px] mb-3"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[70%] h-6"} />
            </div>
        )
    }
    return (
        <div className={"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6"}>
            {skeletonLoading}
        </div>
    )
}