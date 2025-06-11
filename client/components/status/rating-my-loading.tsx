import { Skeleton } from "../ui/skeleton"

export const RatingMyLoading = () => {
    return (
        <div className="space-y-2 lg:space-y-3">
            <Skeleton className="rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-6 lg:h-7" />

            <div className="max-w-full lg:w-50">
                <div className="bg-white p-2 lg:p-3 rounded-2xl shadow w-full lg:w-250">
                    <div className="flex justify-between">
                        <div className="space-y-1.5 lg:space-y-2 w-full">
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <Skeleton className="rounded-full bg-[#E5E5EA] w-8 h-8 lg:w-10 lg:h-10" />
                                <div className="flex flex-col space-y-1">
                                    <Skeleton className="rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-24 lg:w-28 h-4 lg:h-5" />
                                    <Skeleton className="rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-20 lg:w-24 h-3 lg:h-4" />
                                </div>
                            </div>
                            <Skeleton className="rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[30%] h-5" />
                            <Skeleton className="rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-full h-16 lg:h-20" />
                            <Skeleton className="rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[30%] h-16 lg:h-20" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}