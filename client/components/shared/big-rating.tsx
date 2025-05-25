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
            <div className={"w-[85%] h-[90%] rounded-2xl flex items-center justify-center bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 z-[141]"}>
                <button className={"absolute right-2 top-2 cursor-pointer"} onClick={() => isSetBigRating(false)}><X /></button>
                <div className={"flex w-[80%]"}>
                    <Swiper className="w-[80%] h-[800px]" navigation={true} modules={[Navigation]}>
                        {oneRating?.img.map((el, i) => (
                            <SwiperSlide key={i}>
                                <Image className={"object-contain"} src={el} alt={el} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={"w-[30%] p-3 space-y-2 bg-[#F8F8F8] rounded-2xl"}>
                        <div className={"flex justify-between w-full"}>
                            <span>
                                {oneRating?.name}
                            </span>
                            <div>
                                <div>
                                    {GradeRating(Number(oneRating?.grade))}
                                    {DatePost(String(oneRating?.createdAt))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>{oneRating?.gradeText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}