"use client"

import { useGetRatingQuery } from '@/store/apiSlice'
import { Star } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper/modules';
import { WriteRating } from './write-rating'

interface Props {
    className?: string
}

interface Rating {
    id: number,
    name: string,
    grade: number,
    gradeText: string,
    img: Array<string>,
    productId: number
}

export const Rating: React.FC<Props> = ({ }) => {
    const router = useParams()
    const productId = router.productId
    const { data, isLoading, isError } = useGetRatingQuery(Number(productId))

    if (isLoading) return <h1>Загрузка</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>ОТзывов нету</h1>

    const averageRating = data.rating.reduce((sum, el) => sum + el.grade, 0) / data.rating.length
    return (
        <div className={"mt-20"}>
            <span>Средний рейтинг: {averageRating.toFixed(1)}</span>
            <div className='flex justify-between py-3'>
                <Swiper style={{
                    '--swiper-navigation-color': 'black',
                }} navigation={true} modules={[Navigation]} slidesPerView={3} spaceBetween={30}>
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

                        return (
                            <SwiperSlide className='flex flex-col bg-[#F8F8F8] w-[467px] min-h-[207px] p-3 rounded-2xl' key={el.id}>
                                <div className='w-full flex justify-between'>
                                    <div>{el.name}</div>
                                    <div>{grade}</div>
                                </div>
                                <div>{el.gradeText}</div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
            <WriteRating />
        </div>
    )
}