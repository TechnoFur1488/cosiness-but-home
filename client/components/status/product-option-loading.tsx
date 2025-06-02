import { Skeleton } from "../ui/skeleton"

export const ProductOptionLoading = () => {
    return (
        <div>
            <div className={"flex justify-between items-center"}>
                <Skeleton className={"min-w-124.5 h-175 rounded-2xl bg-[#E5E5EA]"} />
                <div className={"flex flex-wrap justify-between flex-col"}>
                    <div className={"flex justify-between"}>
                        <Skeleton className={"rounded-2xl w-61 h-[345px] bg-[#E5E5EA] mr-2.5"} />
                        <Skeleton className={"rounded-2xl w-61 h-[345px] bg-[#E5E5EA]"} />
                    </div>
                    <div className={"flex justify-between mt-2.5"}>
                        <Skeleton className={"rounded-2xl w-61 h-[345px] bg-[#E5E5EA] mr-2.5"} />
                        <Skeleton className={"rounded-2xl w-61 h-[345px] bg-[#E5E5EA]"} />
                    </div>
                </div>
            </div>
            <div className={"mt-9 space-y-3"}>
                <Skeleton className={"rounded-2xl w-[30%] h-[33px] bg-[#E5E5EA]"} />
                <Skeleton className={"rounded-2xl w-full h-[48px] bg-[#E5E5EA]"} />
                <Skeleton className={"rounded-2xl w-[35%] h-[27px] bg-[#E5E5EA]"} />
                <Skeleton className={"rounded-2xl w-[50%] h-[26px] bg-[#E5E5EA]"} />
                <Skeleton className={"rounded-2xl w-[20%] h-[27px] bg-[#E5E5EA]"} />
                <div>
                    <Skeleton className={"rounded-2xl w-[7%] h-[24px] mb-1 bg-[#E5E5EA]"} />
                    <Skeleton className={"rounded-2xl w-[7%] h-[21px] bg-[#E5E5EA]"} />
                </div>
                <div className={"space-y-3"}>
                    <Skeleton className={"rounded-2xl w-[20%] h-[36px] bg-[#E5E5EA]"} />
                    <Skeleton className={"rounded-2xl w-[20%] h-[36px] bg-[#E5E5EA]"} />
                </div>
                <Skeleton className={"rounded-2xl w-[22%] h-[27px] bg-[#E5E5EA]"} />
                <div className={"space-y-4"}>
                    <div className={"h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex"}>
                        <div className={"w-[50%] space-y-1"}>
                            <Skeleton className={"rounded-2xl w-[10%] h-5 bg-[#E5E5EA]"} />
                            <Skeleton className={"rounded-2xl w-[7%] h-5 bg-[#E5E5EA]"} />
                        </div>
                        <div className={"w-[50%] space-y-1"}>
                            <Skeleton className={"rounded-2xl w-[10%] h-5 bg-[#E5E5EA]"} />
                            <Skeleton className={"rounded-2xl w-[7%] h-5 bg-[#E5E5EA]"} />
                        </div>
                    </div>
                    <div className={"h-[1px] bg-[#E5E8EB]"} />
                    <div className={"flex"}>
                        <div className={"w-[50%] space-y-1"}>
                            <Skeleton className={"rounded-2xl w-[10%] h-5 bg-[#E5E5EA]"} />
                            <Skeleton className={"rounded-2xl w-[7%] h-5 bg-[#E5E5EA]"} />
                        </div>
                        <div className={"w-[50%] space-y-1"}>
                            <Skeleton className={"rounded-2xl w-[10%] h-5 bg-[#E5E5EA]"} />
                            <Skeleton className={"rounded-2xl w-[7%] h-5 bg-[#E5E5EA]"} />
                        </div>
                    </div>
                    <div className={"h-[1px] bg-[#E5E8EB]"} />
                    <div>
                        <div className={"w-[50%] space-y-1"}>
                            <Skeleton className={"rounded-2xl w-[10%] h-5 bg-[#E5E5EA]"} />
                            <Skeleton className={"rounded-2xl w-[7%] h-5 bg-[#E5E5EA]"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}