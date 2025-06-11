import { Skeleton } from "../ui/skeleton"

export const FavoriteLoading = () => {
    return (
        <div className="absolute z-20 p-4 right-0 top-0">
            <Skeleton className="rounded-full bg-[#E5E5EA] w-5 h-5 lg:w-6 lg:h-6" />
        </div>
    )
}
