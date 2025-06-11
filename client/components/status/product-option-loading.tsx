import { Skeleton } from "../ui/skeleton"

export const ProductOptionLoading = () => {
    return (
        <div>
            <div className={"flex flex-col lg:flex-row gap-1 lg:gap-2.5"}>
                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-full lg:w-[500px] h-[250px] sm:h-[400px] md:h-[550px] lg:h-[700px]"} />
                
                <div className="hidden lg:grid grid-cols-2 gap-2 w-[500px] h-[700px]">
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-[345px]"} />
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-[345px]"} />
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-[345px]"} />
                    <Skeleton className={"rounded-2xl bg-[#E5E5EA] w-full h-[345px]"} />
                </div>
            </div>

            <div className={"mt-6 lg:mt-9 space-y-2 lg:space-y-3"}>
                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[80%] h-[30px] lg:h-[33px]"} />
                
                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[24px] lg:h-[27px] mt-2"} />
                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-full h-[100px] lg:h-[120px]"} />
                
                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[24px] lg:h-[27px] mt-3"} />
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 lg:gap-3">
                    <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] h-[36px] lg:h-[40px]"} />
                    <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] h-[36px] lg:h-[40px]"} />
                    <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] h-[36px] lg:h-[40px]"} />
                    <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] h-[36px] lg:h-[40px]"} />
                </div>

                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[30%] h-[24px] lg:h-[27px] mt-3"} />
                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[30px] lg:h-[36px]"} />
                
                <div className={"flex flex-col lg:flex-row gap-2 lg:gap-3 mt-4 lg:w-[50%]"}>
                    <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-full lg:w-1/2 h-[32px] lg:h-[36px]"} />
                    <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-full lg:w-1/2 h-[32px] lg:h-[36px]"} />
                </div>

                <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[45%] h-[24px] lg:h-[27px] mt-4"} />
                
                <div className={"space-y-3 lg:space-y-4 mt-2"}>
                    <div className={"h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex justify-between"}>
                        <div className={"w-[45%] space-y-2"}>
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[60%] h-[18px] lg:h-[21px]"} />
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[18px] lg:h-[21px]"} />
                        </div>
                        <div className={"w-[45%] space-y-2"}>
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[60%] h-[18px] lg:h-[21px]"} />
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[18px] lg:h-[21px]"} />
                        </div>
                    </div>
                    <div className={"h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex justify-between"}>
                        <div className={"w-[45%] space-y-2"}>
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[60%] h-[18px] lg:h-[21px]"} />
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[18px] lg:h-[21px]"} />
                        </div>
                        <div className={"w-[45%] space-y-2"}>
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[60%] h-[18px] lg:h-[21px]"} />
                            <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[18px] lg:h-[21px]"} />
                        </div>
                    </div>
                    <div className={"h-[1px] bg-[#E5E8EB]"} />
                    <div className={"w-[45%] space-y-2"}>
                        <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[60%] h-[18px] lg:h-[21px]"} />
                        <Skeleton className={"rounded-lg sm:rounded-2xl bg-[#E5E5EA] w-[40%] h-[18px] lg:h-[21px]"} />
                    </div>
                </div>
            </div>
        </div>
    )
}