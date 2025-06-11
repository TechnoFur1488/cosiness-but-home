"use client"

import { useDeleteRatingMutation, useLazyGetAllRatingQuery } from "@/store/apiSlice"
import { useCallback, useEffect, useRef, useState } from "react"
import { RatingLoading } from "../status/rating-loading"
import { Trash2, User } from "lucide-react"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import Image from "next/image"
import { DatePost, GradeRating } from "../utils"
import { UpdateRating } from "./update-rating"
import { ScrollArea } from "../ui/scroll-area"

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: string[]
    productId: number
    createdAt: string
}

export const RatingAll = () => {
    const [trigger, { data, isLoading, isError, isFetching }] = useLazyGetAllRatingQuery()
    const [currentOffset, setCurrentOffset] = useState(0)
    const observerTarget = useRef<HTMLDivElement>(null)
    const role = useTokenDecryptor()
    const [deleteRating] = useDeleteRatingMutation()

    const handleDelete = async (id: number) => {
        try {
            await deleteRating(id).unwrap()
        } catch (err) {
            alert("Рейтинг не был удален")
        }
    }

    useEffect(() => {
        trigger({ offset: 0 }, true)
    }, [trigger])

    const loadMore = useCallback(() => {
        if (!isFetching && data?.hasMore) {
            setCurrentOffset(data.nextOffset)
            trigger({
                offset: data.nextOffset
            })
        }
    }, [isFetching, data, trigger])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore()
                }
            },
            {
                threshold: 0.1,
                rootMargin: "100px"
            }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [loadMore])

    if (isLoading && !data) return <RatingLoading />
    if (isError) return <h1 className="text-base lg:text-lg">Ошибка при загрузке отзывов</h1>
    if (!data?.rating?.length) return <h1 className="text-base lg:text-lg">Отзывов пока нет</h1>

    return (
        <div className={"mt-10 lg:mt-20"}>
            <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6">Отзывы</h2>
            <ScrollArea className='h-[400px] lg:h-266'>
                <div className="space-y-3 lg:space-y-5">
                    {data.rating.map((rating: Rating, i: number) => (
                        <div key={`${rating.id}-${i}`} className="bg-white p-2 lg:p-3 rounded-2xl shadow relative">
                            <div className="space-y-1.5 lg:space-y-2">
                                <div className="flex items-center space-x-2 lg:space-x-3">
                                    <div className="bg-gray-200 rounded-3xl w-8 h-8 lg:w-10 lg:h-10 flex justify-center items-center shadow">
                                        <User className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm lg:text-base">{rating.name}</span>
                                        <span className="font-light text-xs lg:text-sm">{DatePost(rating.createdAt)}</span>
                                    </div>
                                </div>
                                <div>
                                    {GradeRating(rating.grade)}
                                </div>
                                {role === "ADMIN" &&
                                    <div className={"space-x-2 lg:space-x-3 min-w-12 lg:min-w-15 flex items-start"}>
                                        <UpdateRating isImg={rating.img} isName={rating.name} isGrade={rating.grade} isGradeText={rating.gradeText} isId={rating.id} />
                                        <button className={"cursor-pointer"} onClick={() => handleDelete(rating.id)}>
                                            <Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' size={20} />
                                        </button>
                                    </div>
                                }
                                <p className="font-light text-sm lg:text-base">{rating.gradeText}</p>
                                {rating.img.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 lg:gap-4">
                                        {rating.img.map((img, index) => (
                                            <div key={index} className="relative w-full aspect-[4/5]">
                                                <Image
                                                    src={img}
                                                    alt={`Изображение ${index + 1}`}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div
                        ref={observerTarget}
                        className="h-8 lg:h-10"
                        style={{ visibility: data?.hasMore ? 'visible' : 'hidden' }}
                    />

                    {isFetching && (
                        <RatingLoading />
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}