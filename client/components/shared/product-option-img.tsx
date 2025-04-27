"use client"

import React, { useState } from 'react'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper"
import Image from 'next/image';

interface Props {
    className?: string
    isImg: Array<string>
}

export const ProductOptionImg: React.FC<Props> = ({ isImg }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    return (
        <div className={"w-[463px]"}>
            <Swiper loop={true} className='rounded-2xl' autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }} spaceBetween={30} thumbs={{ swiper: thumbsSwiper }} modules={[FreeMode, Thumbs, Autoplay]}>
                {isImg.map((el, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <Image className={"rounded-2xl"} src={el} alt='Картинка' width={463} height={463} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <Swiper className={"w-[463px] flex justify-between items-center mt-5"} onSwiper={setThumbsSwiper} spaceBetween={10} slidesPerView={4} freeMode={true} modules={[FreeMode, Thumbs]}>
                {isImg.map((el, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <Image className='rounded-2xl' src={el} alt='' width={102} height={102} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    )
}