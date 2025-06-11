import { Skeleton } from "../ui/skeleton"

export const RatingStatisticsLoading = () => {
    return (
        <div>
            <div className="flex flex-col space-y-2 mb-4">
                <Skeleton className="w-16 sm:w-20 h-7 sm:h-8 rounded-lg sm:rounded-2xl bg-[#E5E5EA]" />
                <div className="flex space-x-1">
                    <Skeleton className="w-[50%] rounded-2xl bg-[#E5E5EA]" />
                </div>
                <Skeleton className="w-24 sm:w-28 h-5 sm:h-6 rounded-lg sm:rounded-2xl bg-[#E5E5EA]" />
            </div>

            <div className="w-full sm:w-85 space-y-2 sm:space-y-3">
                {[5, 4, 3, 2, 1].map((num) => (
                    <div key={num} className="flex items-center space-x-2 sm:space-x-3">
                        <span className="w-2 sm:w-3 flex justify-center">
                            <Skeleton className="w-3 sm:w-4 h-4 sm:h-5 rounded-lg sm:rounded-2xl bg-[#E5E5EA]" />
                        </span>
                        <div className="flex-1">
                            <Skeleton className="w-full sm:w-62 h-2 sm:h-3 rounded-lg sm:rounded-2xl bg-[#E5E5EA]" />
                        </div>
                        <Skeleton className="w-8 sm:w-10 h-4 sm:h-5 rounded-lg sm:rounded-2xl bg-[#E5E5EA]" />
                    </div>
                ))}
            </div>
        </div>
    )
}