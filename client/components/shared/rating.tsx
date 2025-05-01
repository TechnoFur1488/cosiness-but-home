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
import { ModalInformation } from './modal-information'

interface Props {
    className?: string
}

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: Array<string>
    productId: number
    createdAt: string
}

export const Rating: React.FC<Props> = ({ }) => {
    const router = useParams()
    const productId = router.productId
    const { data, isLoading, isError } = useGetRatingQuery(Number(productId))
    const [deleteRating] = useDeleteRatingMutation()
    const [bigImg, setBigImg] = useState(false)

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
            {averageRating ? <span>Средний рейтинг: {averageRating.toFixed(1)}</span> : <span>Отзывов пока что нет</span>}
            <div className='flex justify-between py-3'>
                <Swiper style={{
                    '--swiper-navigation-color': 'black',
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
                            <SwiperSlide className='flex flex-col bg-[#F8F8F8] min-w-[467px] min-h-[207px] p-3 rounded-2xl' key={el.id}>
                                <div className='w-full flex justify-between items-center'>
                                    <div>{el.name}</div>
                                    <div>{grade}</div>
                                </div>
                                <div className='flex justify-between'>
                                    <div>
                                        <button className='cursor-pointer' onClick={() => handleDelete(el.id)}><Trash className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} /></button>
                                        <UpdateRating isName={el.name} isGrade={el.grade} isGradeText={el.gradeText} isImg={el.img} isId={el.id} />
                                    </div>
                                    <span className='text-[13px]'>{datePublic(el.createdAt)}</span>
                                </div>
                                <div className='flex justify-between items-start'>
                                    <p className='w-[80%]'>
                                        {gradeText}
                                        {gradeText?.length > 150 && (
                                            <ModalInformation>{el.gradeText}</ModalInformation>
                                        )}
                                    </p>
                                    <Swiper modules={[Navigation]} className='w-40 flex justify-center' slidesPerView={1} spaceBetween={10}>
                                        {el.img.map((el, i) => (
                                            <SwiperSlide key={i}>
                                                <button className='cursor-pointer' onClick={e => setBigImg(true)}>
                                                    <Image src={el} width={100} height={120} alt='Фото отзыва' />
                                                </button>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
            <WriteRating />

        </div >
    )
}