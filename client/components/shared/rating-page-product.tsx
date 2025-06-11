"use client"

import { useDeleteRatingMutation, useLazyGetRatingLazyQuery } from "@/store/apiSlice"
import { useParams } from "next/navigation"
import { Trash2, User } from "lucide-react"
import Image from "next/image"
import { GradeRating, DatePost } from "../utils"
import { useEffect, useState, useRef, useCallback } from "react"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { UpdateRating } from "./update-rating"
import { BigRating } from "./big-rating"
import { RatingLoading } from "../status/rating-loading"

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: string[]
    productId: number
    createdAt: string
}

export const RatingPageProduct = () => {
    const router = useParams()
    const productId = router.productId
    const [trigger, { data: lazyRating, isLoading, isError, isFetching }] = useLazyGetRatingLazyQuery()
    const [deleteRating] = useDeleteRatingMutation()
    const [currentOffset, setCurrentOffset] = useState(0)
    const observerTarget = useRef<HTMLDivElement>(null)
    const role = useTokenDecryptor()
    const [bigRating, setBigRating] = useState(false)
    const [ratingId, setRatingId] = useState<number>(0)

    useEffect(() => {
        trigger({ productId: Number(productId), offset: 0 })
    }, [productId, trigger])

    const loadMore = useCallback(() => {
        if (!isLoading && lazyRating?.hasMore) {
            setCurrentOffset(lazyRating.nextOffset)
            trigger({
                productId: Number(productId),
                offset: lazyRating.nextOffset
            })
        }
    }, [isLoading, lazyRating, productId, trigger])

    const handleDelete = async (id: number) => {
        try {
            await deleteRating(id).unwrap()
        } catch (err) {
            alert("Рейтинг не был удален")
        }
    }

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

    if (isLoading && !lazyRating) return <RatingLoading />
    if (isError) return <h1>Ошибка при загрузке отзывов</h1>
    if (!lazyRating?.ratings?.length) return <h1>Отзывов пока нет</h1>

    return (
        <>
            {bigRating &&
                <div className={"fixed inset-0 z-50 flex items-center justify-center"}>
                    <div className={"absolute inset-0 bg-black opacity-50"} onClick={() => setBigRating(false)} />
                    <BigRating isBigRating={bigRating} isSetBigRating={setBigRating} ratingId={ratingId} />
                </div>
            }
            <div className="space-y-5">
                {lazyRating.ratings.map((rating: Rating, i: number) => (
                    <div key={`${rating.id}-${i}`} className="bg-white p-3 rounded-2xl shadow relative">
                        <div className="space-y-2" onClick={() => {
                            if (rating.img.length > 0) {
                                setBigRating(true), setRatingId(rating.id)
                            }
                        }}>
                            <div className="flex items-center space-x-3">
                                <div className="bg-gray-200 rounded-3xl w-10 h-10 flex justify-center items-center shadow">
                                    <User />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">{rating.name}</span>
                                    <span className="font-light text-sm">{DatePost(rating.createdAt)}</span>
                                </div>
                            </div>
                            <div>
                                {GradeRating(rating.grade)}
                            </div>
                            {role === "ADMIN" &&
                                <div className={"space-x-3 min-w-15"}>
                                    <UpdateRating isImg={rating.img} isName={rating.name} isGrade={rating.grade} isGradeText={rating.gradeText} isId={rating.id} />
                                    <button className={"cursor-pointer"} onClick={() => handleDelete(rating.id)}>
                                        <Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} />
                                    </button>
                                </div>
                            }
                            <p className="font-light">{rating.gradeText}</p>
                            {rating.img.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {rating.img.map((img, index) => (
                                        <div key={index} className="relative w-full h-[200px]">
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
                    className="h-10"
                    style={{ visibility: lazyRating?.hasMore ? 'visible' : 'hidden' }}
                />

                {isFetching && (
                    <RatingLoading />
                )}
            </div>
        </>
    )
}