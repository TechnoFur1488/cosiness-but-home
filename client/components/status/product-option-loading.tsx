import { Skeleton } from "../ui/skeleton"

export const ProductOptionLoading = () => {
    return (
        <div className={"h-[692px] flex justify-between"}>
            <div className={"flex flex-col justify-between w-[463px]"}>
                <Skeleton className={"w-[463px] h-137.5 bg-[#E5E5EA] rounded-2xl"} />
                <div className={"flex justify-between"}>
                    <Skeleton className={"w-[108.25px] h-30.5 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[108.25px] h-30.5 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[108.25px] h-30.5 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[108.25px] h-30.5 rounded-2xl bg-[#E5E5EA]"} />
                </div>
            </div>
            <div className={"w-[467px] flex flex-col justify-between"}>
                <Skeleton className={"w-full h-15 rounded-2xl bg-[#E5E5EA]"} />
                <Skeleton className={"w-full h-12 rounded-2xl bg-[#E5E5EA] my-2.5"} />
                <div className={"flex flex-col h-40 justify-between"}>
                    <Skeleton className={"w-[70%] h-6 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[70%] h-6 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[70%] h-6 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[70%] h-6 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-[70%] h-6 rounded-2xl bg-[#E5E5EA]"} />
                </div>
                <Skeleton className={"w-full h-12 rounded-2xl my-2.5 bg-[#E5E5EA]"} />
                <Skeleton className={"w-full h-9 rounded-2xl bg-[#E5E5EA]"} />
                <Skeleton className={"w-full h-12 rounded-2xl bg-[#E5E5EA]"} />
                <Skeleton className={"w-full h-18 rounded-2xl my-2.5 bg-[#E5E5EA]"} />
            </div>
            <Skeleton className={"h-[195px] rounded-2xl"}>
                <div className={"mx-4 py-[27px] w-[313px] h-full flex flex-col justify-between"}>
                    <Skeleton className={"w-[80%] h-8 rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-full h-[39px] rounded-2xl bg-[#E5E5EA]"} />
                    <Skeleton className={"w-full h-[39px] rounded-2xl bg-[#E5E5EA]"} />
                </div>
            </Skeleton>
        </div>
    )
}