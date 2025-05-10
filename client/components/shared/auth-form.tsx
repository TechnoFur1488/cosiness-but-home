"use client"

import React, { useState } from 'react'
import { Login } from './login'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Register } from './register'
import type { Swiper as SwiperType } from "swiper"

import 'swiper/css'
import 'swiper/css/thumbs';

import { Thumbs } from 'swiper/modules'
import { cn } from '@/lib/utils'

interface Props {
    className?: string
}

export const AuthForm: React.FC<Props> = ({ className }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)
    const [status, setStatus] = useState(false)

    return (
        <div>
            <Swiper className={"bg-[#F8F8F8] rounded-2xl w-100"} onSwiper={setThumbsSwiper} spaceBetween={0} slidesPerView={2} watchSlidesProgress={true}>
                <SwiperSlide onClick={() => setStatus(false)}>
                    <div className={cn(!status && "bg-[#DBDBDB] rounded-2xl", "p-2 cursor-pointer text-center")} >
                        <span>Войти</span>
                    </div>
                </SwiperSlide>
                <SwiperSlide onClick={() => setStatus(true)}>
                    <div className={cn(status && "bg-[#DBDBDB] rounded-2xl", "p-2 cursor-pointer text-center")}>
                        <span>Зарегистрироваться</span>
                    </div>
                </SwiperSlide>
            </Swiper>
            <Swiper className={"w-120 mt-5 rounded-2xl"} allowTouchMove={false} noSwiping={true} modules={[Thumbs]} thumbs={{ swiper: thumbsSwiper }} spaceBetween={30} slidesPerView={1}>
                <SwiperSlide>
                    <Login />
                </SwiperSlide>
                <SwiperSlide>
                    <Register />
                </SwiperSlide>
            </Swiper>
        </div>
    )
}