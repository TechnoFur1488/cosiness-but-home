"use client"

import { useDeleteRatingMutation, useGetRatingQuery } from '@/store/apiSlice'
import { Star, Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { WriteRating } from './write-rating'
import Image from 'next/image'
import { UpdateRating } from './update-rating'
import { cn } from '@/lib/utils'

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

    if (isLoading) return <h1>Загрузка</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>ОТзывов нету</h1>

    const handleDelete = async (id: number) => {
        try {
            await deleteRating(id).unwrap()
        } catch (err) {
            alert("Рейтинг не был удален")
        }
    }

    const datePublic = (component: string) => {
        let options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return new Date(component).toLocaleString("ru-RU", options)
    }

    const averageRating = data.rating.reduce((sum, el) => sum + el.grade, 0) / data.rating.length
    return (
        <div className={"mt-20"}>
            {averageRating ? <span className={"font-medium text-[20px]"}>Средний рейтинг: {averageRating.toFixed(1)}</span> : <span className={"font-medium text-[20px]"}>Отзывов пока что нет</span>}
            <div className='flex justify-between py-3'>
                <Swiper style={{
                    '--swiper-navigation-color': 'black'
                }} navigation={true} modules={[Navigation]} slidesPerView={3} spaceBetween={10}>
                    {data?.rating?.map((el: Rating) => {

                        let grade

                        if (el.grade === 5) {
                            grade =
                                <div className='flex'>
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                </div>
                        } else if (el.grade === 4) {
                            grade =
                                <div className='flex'>
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                </div>
                        } else if (el.grade === 3) {
                            grade =
                                <div className='flex'>
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                </div>
                        } else if (el.grade === 2) {
                            grade =
                                <div className='flex'>
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                </div>
                        } else if (el.grade === 1) {
                            grade =
                                <div className='flex'>
                                    <Star className='text-yellow-400' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                    <Star className='text-gray-300' fill='currentColor' />
                                </div>
                        }

                        let gradeText: string = el.gradeText

                        if (gradeText?.length > 150) {
                            gradeText = gradeText.slice(0, 150) + "..."
                        }

                        return (
                            <SwiperSlide className={'flex flex-col bg-[#F8F8F8] min-w-[467px] min-h-[207px] p-3 rounded-2xl space-y-2 '} key={el.id}>
                                <div className={'w-full flex justify-between items-center'}>
                                    <span className={"text-[18px]"}>{el.name}</span>
                                    <div>{grade}</div>
                                </div>
                                <div className={'flex justify-between'}>
                                    <div>
                                        <button className={'cursor-pointer'} onClick={() => handleDelete(el.id)}><Trash className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} /></button>
                                        <UpdateRating isName={el.name} isGrade={el.grade} isGradeText={el.gradeText} isId={el.id} />
                                    </div>
                                    <span className={'text-[13px]'}>{datePublic(el.createdAt)}</span>
                                </div>
                                <div className={'flex justify-between items-start cursor-pointer'}>
                                    <p className={"w-65"}>{gradeText.length > 150 && gradeText}</p>
                                    <div className={"relative w-38 h-25"}>
                                        {el.img.slice(0, 3).map((el, i) => (
                                            <div key={i} className={cn(
                                                "absolute top-0 w-[110px] h-[150px] rounded-md border-2 border-white transition-all",
                                                "shadow-md overflow-hidden",
                                                {
                                                    "left-0 z-30": i === 0,
                                                    "left-6 z-20": i === 1,
                                                    "left-12 z-10": i === 2,
                                                    // "hover:z-40 hover:scale-110": true
                                                }
                                            )}
                                            >
                                                <Image src={el} alt={el} fill sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* <p>{gradeText.length > 150 && gradeText}</p> */}
                                {/* <p className={'w-[80%] text-[15px]'}> */}
                                {/* {el.gradeText} */}
                                {/* {gradeText?.length > 150 && (
                                                    { el.gradeText }
                                                )} */}
                                {/* </p> */}
                                {/* <Swiper modules={[Navigation]} className={'min-w-30 h-35 flex justify-center rounded-2xl'} slidesPerView={1} spaceBetween={10}>
                                            {el.img.map((el, i) => (
                                                <SwiperSlide key={i}>
                                                    <div className="relative z-10 w-full h-full">
                                                        <Image src={el} className={'rounded-2xl'} fill sizes="(max-width: 768px) 100vw, 345px" alt='Фото отзыва' />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper> */}
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
            <WriteRating />

        </div >
    )
}