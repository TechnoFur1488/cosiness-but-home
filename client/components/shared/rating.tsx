"use client"

import { useDeleteRatingMutation } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { BigRating } from './big-rating'
import Link from 'next/link'
import { RatingMy } from './rating-my'
import { RatingProduct } from './rating-product'
import { RatingStatistics } from './rating-statistics'

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: string[]
    productId: number
    createdAt: string
}

export const Rating = () => {
    const router = useParams()
    const productId = router.productId
    const [deleteRating] = useDeleteRatingMutation()
    const [bigRating, setBigRating] = useState(false)
    const [ratingId, setRatingId] = useState<number>(0)

    const handleDelete = async (id: number) => {
        try {
            await deleteRating(id).unwrap()
        } catch (err) {
            alert("Рейтинг не был удален")
        }
    }

    const maxLengthText = (text: string) => {
        if (text?.length > 200) {
            return text.slice(0, 200) + '...'
        } else {
            return text
        }
    }

    return (
        <>
            {bigRating &&
                <div className={cn("fixed inset-0 z-50 flex items-center justify-center")}>
                    <div className={"absolute inset-0 bg-black opacity-50"} onClick={() => setBigRating(false)} />
                    <BigRating isBigRating={bigRating} isSetBigRating={setBigRating} ratingId={ratingId} />
                </div>
            }
            <div className={"space-y-3"}>
                <h2 className={"font-bold text-[18px]"}>Рейтинг товара</h2>
                <div className={"flex items-center space-x-5"}>
                    <RatingStatistics productId={productId} />
                </div>
                <RatingMy productId={productId} isHandleDelete={handleDelete} isMaxLengthText={maxLengthText} isSetBigRating={setBigRating} isSetRatingId={setRatingId} />
                <h2 className={"font-bold text-[18px]"}>Отзывы клиентов</h2>
                <div className={"space-y-5"}>
                    <RatingProduct productId={productId} setBigRating={setBigRating} setRatingId={setRatingId} maxLengthText={maxLengthText} handleDelete={handleDelete} />
                </div>
                <div className={"w-full text-end"}>
                    <Link href={`/rating/${productId}`}>Смотреть все отзывы</Link>
                </div>
            </div>
        </>
    )
}