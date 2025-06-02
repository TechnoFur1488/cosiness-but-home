import { useGetMyRatingQuery } from "@/store/apiSlice"
import { WriteRating } from "./write-rating"
import { UpdateRating } from "./update-rating"
import { DatePost, GradeRating } from "../utils"
import { Trash2, User } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ParamValue } from "next/dist/server/request/params"
import { RatingMyLoading } from "../status/rating-my-loading"

interface Props {
    productId: ParamValue
    isHandleDelete: (id: number) => void
    isMaxLengthText: (text: string) => string | undefined
    isSetBigRating: React.Dispatch<React.SetStateAction<boolean>>
    isSetRatingId: React.Dispatch<React.SetStateAction<number>>
}

export const RatingMy = ({ productId, isHandleDelete, isMaxLengthText, isSetBigRating, isSetRatingId }: Props) => {
    const { data, isLoading, isError } = useGetMyRatingQuery(Number(productId))

    if (isLoading) return <RatingMyLoading />
    if (isError) return <p>Error</p>

    return (
        <>
            <h2 className={"font-bold text-[18px]"}>{data?.myRating ? "Ваш отзыв" : "Напишите свой отзыв"}</h2>
            <div className={"w-50"}>
                {data?.myRating
                    ?
                    <div key={data?.myRating.id} className={"bg-white p-3 rounded-2xl shadow w-250 flex justify-between"}>
                        <div className={"space-y-2 cursor-pointer"} onClick={() => {
                            if (data?.myRating.gradeText.length > 200 || data?.myRating.img.length > 0) {
                                isSetBigRating(true), isSetRatingId(data?.myRating.id)
                            }
                        }}>
                            <div className={"flex items-center space-x-3"}>
                                <div className={"bg-gray-200 rounded-3xl w-10 h-10 flex justify-center items-center shadow"}>
                                    <User />
                                </div>
                                <div className={"flex flex-col"}>
                                    <span className={"font-medium"}>{data?.myRating.name}</span>
                                    <span className={"font-light text-sm"}>{DatePost(data?.myRating.createdAt)}</span>
                                </div>
                            </div>
                            <div>
                                {GradeRating(data?.myRating.grade)}
                            </div>
                            <p className={"font-light"}>{isMaxLengthText(data?.myRating.gradeText)}</p>
                            {data?.myRating.img.length > 0 &&
                                <div className={"flex relative w-[110px] h-[150px]"}>
                                    {data?.myRating.img.slice(0, 3).map((el: string, i: number) => (
                                        <div className={cn("absolute shadow w-[110px] h-[150px]", {
                                            "left-0 z-30": i === 0,
                                            "left-6 z-20": i === 1,
                                            "left-12 z-10": i === 2,
                                        })} key={i}>
                                            <Image className={"rounded-2xl"} src={el} alt={el} fill sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                        <div className={"space-x-3"}>
                            <UpdateRating isImg={data?.myRating.img} isName={data?.myRating.name} isGrade={data?.myRating.grade} isGradeText={data?.myRating.gradeText} isId={data?.myRating.id} />
                            <button className={'cursor-pointer'} onClick={() => isHandleDelete(data?.myRating.id)}><Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} /></button>
                        </div>
                    </div>
                    :
                    <WriteRating />
                }
            </div>
        </>
    )
}