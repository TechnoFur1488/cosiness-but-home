"use client"

import { useDeleteRatingMutation, useGetMyRatingQuery, useGetRatingQuery } from '@/store/apiSlice'
import { MoveRight, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules';
import { WriteRating } from './write-rating'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MyRating } from './my-rating'
import 'swiper/css';
import 'swiper/css/navigation';
import { BigRating } from './big-rating'
import Link from 'next/link'
import { GradeRating, DatePost } from '../utils'
import { useTokenDecryptor } from '../hooks/use-token-decryptor'
import { UpdateRating } from './update-rating'
import { RatingLoading } from '../status/rating-loading'

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
    const { data, isLoading, isError } = useGetRatingQuery(Number(productId))
    const [deleteRating] = useDeleteRatingMutation()
    const [bigRating, setBigRating] = useState(false)
    const { data: myRating, isLoading: myRatingLoading, isError: myRatingError } = useGetMyRatingQuery(Number(productId))
    const [ratingId, setRatingId] = useState<number>(0)
    const role = useTokenDecryptor()

    const rating = data?.rating

    if (isLoading) return <RatingLoading />
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Отзывов нету</h1>

    const handleDelete = async (id: number) => {
        try {
            await deleteRating(id).unwrap()
        } catch (err) {
            alert("Рейтинг не был удален")
        }
    }

    const maxLengthText = (text: string) => {
        if (text?.length > 120) {
            return text.slice(0, 120) + '...'
        } else {
            return text
        }
    }

    const averageRating = data.rating.reduce((sum, el) => sum + el.grade, 0) / data.rating.length

    return (
        <>
            {bigRating &&
                <div className={cn("fixed inset-0 z-50 flex items-center justify-center")}>
                    <div className={"absolute inset-0 bg-black opacity-50"} onClick={() => setBigRating(false)} />
                    <BigRating isBigRating={bigRating} isSetBigRating={setBigRating} ratingId={ratingId} />
                </div>
            }
            <div className={"mt-20"}>
                {averageRating ? <span className={"font-medium text-[20px]"}>Средний рейтинг: {averageRating.toFixed(1)}</span> : <span className={"font-medium text-[20px]"}>Отзывов пока что нет</span>}
                <div className='flex justify-between py-3'>
                    <Swiper style={{
                        '--swiper-navigation-color': 'black'
                    } as React.CSSProperties} navigation={true} modules={[Navigation]} slidesPerView={3} spaceBetween={10}>
                        {rating?.slice(0, 12).map((el: Rating) => {

                            return (
                                <SwiperSlide className={'flex flex-col bg-[#F8F8F8] min-w-[467px] min-h-[241px] p-3 rounded-2xl space-y-2 '} key={el.id}>
                                    <div className={'w-full flex justify-between items-center'}>
                                        <span className={"text-[18px]"}>{el.name}</span>
                                        <div>{GradeRating(el.grade)}</div>
                                    </div>
                                    <div className={'flex justify-between'}>
                                        {role === "ADMIN" ?
                                            <div>
                                                <button className={"cursor-pointer"} onClick={() => handleDelete(el.id)}>
                                                    <Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} />
                                                </button>
                                                <UpdateRating isImg={el.img} isName={el.name} isGrade={el.grade} isGradeText={el.gradeText} isId={el.id} />
                                            </div>
                                            : null
                                        }
                                        <span className={'text-[13px]'}>{DatePost(el.createdAt)}</span>
                                    </div>
                                    <div onClick={() => {
                                        if (el.gradeText?.length > 0 || el.img?.length > 0) {
                                            setBigRating(true), setRatingId(el.id)
                                        }
                                    }} className={cn('flex justify-between items-start h-36.5 cursor-auto', el.gradeText?.length > 0 || el.img?.length > 0 ? "cursor-pointer" : "cursor-default")}>
                                        <p className={"w-65"}>{maxLengthText(el.gradeText)}</p>
                                        <div className={"relative w-38"}>
                                            {el.img.slice(0, 3).map((el, i) => (
                                                <div key={i} className={cn(
                                                    "absolute top-0 w-[110px] h-[150px] rounded-md border-2 border-white transition-all",
                                                    "shadow-md overflow-hidden",
                                                    {
                                                        "left-0 z-30": i === 0,
                                                        "left-6 z-20": i === 1,
                                                        "left-12 z-10": i === 2,
                                                    }
                                                )}
                                                >
                                                    <Image src={el} alt={el} fill sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                        <SwiperSlide className={"min-w-[467px] min-h-[241px] bg-[#F8F8F8] rounded-2xl"}>
                            <Link className={'w-full h-full flex items-center flex-col justify-center text-[18px]'} href={"/"}>Читать все отзывы <MoveRight /></Link>
                        </SwiperSlide>
                    </Swiper>
                </div>
                {myRating?.myRating ?
                    <MyRating
                        isLoading={myRatingLoading}
                        isError={myRatingError}
                        isMyRating={myRating.myRating}
                        isSetRatingId={setRatingId}
                        isHandleDelete={handleDelete}
                        isMaxLengthText={maxLengthText}
                        isSetBigRating={setBigRating}
                    />
                    : <WriteRating />}
            </div >
        </>
    )
}
