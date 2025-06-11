import { Skeleton } from "../ui/skeleton"

export const MiniCatalogLoading = () => {
    let skeletonLoading = []

    for (let i = 0; i < 4; i++) {
        skeletonLoading.push(
            <div key={i} className={"flex justify-between flex-col w-full rounded-2xl bg-white shadow p-2"}>
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-[208px] mb-3"} />
                <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-[70%] h-6"} />
            </div>
        )
    }

    return (
        <div className={"grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-3 lg:grid-cols-4"}>
            {skeletonLoading}
        </div>
    )
}