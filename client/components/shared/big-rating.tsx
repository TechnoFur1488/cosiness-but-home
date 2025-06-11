import { X } from "lucide-react"
import { HiddenScrol } from "../utils/hidden-scrol"
import { useGetOneRatingQuery } from "@/store/apiSlice"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import Image from "next/image";
import { DatePost, GradeRating } from "../utils";
import { cn } from "@/lib/utils";

interface Props {
    isBigRating: boolean
    isSetBigRating: React.Dispatch<React.SetStateAction<boolean>>
    ratingId: number
}

export const BigRating = ({ isBigRating, isSetBigRating, ratingId }: Props) => {
    const { data, isLoading, isError } = useGetOneRatingQuery(ratingId)

    const oneRating = data?.rating

    HiddenScrol(isBigRating)

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>

    return (
        <div className={cn("fixed w-full h-screen top-0 left-0 z-[139]")}>
            <div className={"w-[95%] lg:w-[85%] h-[90%] rounded-lg lg:rounded-2xl flex flex-col lg:flex-row items-center justify-center bg-[#f5f5f7] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-[141] p-2 lg:p-4"}>
                <button 
                    className={"absolute right-2 top-2 lg:right-4 lg:top-4 cursor-pointer"} 
                    onClick={() => isSetBigRating(false)}
                >
                    <X className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
                <div className={"flex flex-col lg:flex-row w-full lg:w-[90%] h-full gap-4"}>
                    <Swiper 
                        className="w-full lg:w-[70%] h-[50%] lg:h-[800px]" 
                        navigation={true} 
                        modules={[Navigation]}
                    >
                        {oneRating?.img.map((el, i) => (
                            <SwiperSlide key={i}>
                                <Image 
                                    className={"object-contain"} 
                                    src={el} 
                                    alt={el} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={"w-full lg:w-[30%] h-[45%] lg:h-auto p-3 lg:p-4 space-y-2 bg-white rounded-lg lg:rounded-2xl shadow"}>
                        <div className={"flex justify-between w-full"}>
                            <div className={"flex flex-col"}>
                                <span className={"text-sm lg:text-base font-medium"}>
                                    {oneRating?.name}
                                </span>
                                <span className={"text-xs lg:text-sm font-light"}>{DatePost(String(oneRating?.createdAt))}</span>
                            </div>
                            <div className="scale-90 lg:scale-100">
                                {GradeRating(Number(oneRating?.grade))}
                            </div>
                        </div>
                        <div>
                            <p className={"text-sm lg:text-base font-light"}>{oneRating?.gradeText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}