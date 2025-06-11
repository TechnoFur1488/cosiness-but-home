import { useLazyGetRatingLazyQuery } from "@/store/apiSlice"
import React, { useEffect } from "react"
import { DatePost, GradeRating } from "../utils"
import { Trash2, User } from "lucide-react"
import Image from "next/image"
import { UpdateRating } from "./update-rating"
import { cn } from "@/lib/utils"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { ParamValue } from "next/dist/server/request/params"
import { RatingLoading } from "../status/rating-loading"

interface Props {
    productId: ParamValue
    setBigRating: React.Dispatch<React.SetStateAction<boolean>>
    setRatingId: React.Dispatch<React.SetStateAction<number>>
    maxLengthText: (text: string) => string
    handleDelete: (id: number) => void
    isLenghtRating: React.Dispatch<React.SetStateAction<number>>
}

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: string[]
    productId: number
    createdAt: string
}

export const RatingProduct = ({ isLenghtRating, productId, setBigRating, setRatingId, maxLengthText, handleDelete }: Props) => {
    const [trigger, { data, isLoading, isError }] = useLazyGetRatingLazyQuery()
    const role = useTokenDecryptor()

    useEffect(() => {
        trigger({ productId: Number(productId), offset: 0 })
    }, [productId, trigger])

    useEffect(() => {
        if (!data?.ratings) {
            return isLenghtRating(0)
        }
        isLenghtRating(data.ratings.length > 12 ? 12 : data.ratings.length)

    }, [data])

    if (isLoading) return <RatingLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <>
            {data?.ratings?.map((el: Rating) => {

                return (
                    < div key={el.id} className={"bg-white p-2 lg:p-3 rounded-2xl shadow flex justify-between"} >
                        <div className={"space-y-1.5 lg:space-y-2 cursor-pointer"} onClick={() => {
                            if (el.gradeText.length > 200 || el.img.length > 0) {
                                setBigRating(true), setRatingId(el.id)
                            }
                        }}>
                            <div className={"flex items-center space-x-2 lg:space-x-3"}>
                                <div className={"bg-gray-200 rounded-3xl w-8 h-8 lg:w-10 lg:h-10 flex justify-center items-center shadow"}>
                                    <User className="w-4 h-4 lg:w-5 lg:h-5" />
                                </div>
                                <div className={"flex flex-col"}>
                                    <span className={"font-medium text-sm lg:text-base"}>{el.name}</span>
                                    <span className={"font-light text-xs lg:text-sm"}>{DatePost(el.createdAt)}</span>
                                </div>
                            </div>
                            <div>
                                {GradeRating(el.grade)}
                            </div>
                            <p className={"font-light text-sm lg:text-base"}>{maxLengthText(el.gradeText)}</p>
                            {el.img.length > 0 &&
                                <div className={"flex relative w-[90px] h-[120px] lg:w-[110px] lg:h-[150px]"}>
                                    {el.img.slice(0, 3).map((el, i) => (
                                        <div className={cn("absolute shadow", {
                                            "w-[90px] h-[120px] lg:w-[110px] lg:h-[150px]": true,
                                            "left-0 z-30": i === 0,
                                            "left-4 lg:left-6 z-20": i === 1,
                                            "left-8 lg:left-12 z-10": i === 2,
                                        })} key={i}>
                                            <Image className={"rounded-2xl"} src={el} alt={el} fill sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                        {
                            role === "ADMIN" &&
                            <div className={"space-x-2 lg:space-x-3 flex items-start"}>
                                <UpdateRating isImg={el.img} isName={el.name} isGrade={el.grade} isGradeText={el.gradeText} isId={el.id} />
                                <button className={"cursor-pointer"} onClick={() => handleDelete(el.id)}>
                                    <Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' size={20} />
                                </button>
                            </div>
                        }
                    </div >
                )
            })}
        </>
    )
}