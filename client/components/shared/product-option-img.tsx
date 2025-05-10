"use client"

import React, { useState } from 'react'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper"
import Image from 'next/image';
import { BigImg } from './big-img';
import { Navigation } from 'swiper/modules';

interface Props {
    className?: string
    isImg: Array<string>
}

export const ProductOptionImg: React.FC<Props> = ({ isImg }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [bigImg, setBigImg] = useState(false)

    return (
        <div className={"w-[463px]"}>
            <Swiper loop={true} className='rounded-2xl h-[550px]' autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }} spaceBetween={30} thumbs={{ swiper: thumbsSwiper }} modules={[FreeMode, Thumbs, Autoplay]}>
                {isImg.map((el, i) => {
                    return (
                        <SwiperSlide className="!h-full" key={i}>
                            <div className="relative w-full h-full">
                                <button className='cursor-pointer' onClick={() => setBigImg(true)}>
                                    <Image className={"rounded-2xl object-cover"} fill src={el} alt='Картинка' sizes="(max-width: 768px) 100vw, 800px" />
                                </button>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <Swiper className={"flex justify-between items-center mt-5 h-[122px]"} onSwiper={setThumbsSwiper} spaceBetween={10} slidesPerView={4} freeMode={true} modules={[FreeMode, Thumbs]}>
                {isImg.map((el, i) => {
                    return (
                        <SwiperSlide className="!h-full" key={i}>
                            <div className="relative w-full h-full">
                                <Image className='rounded-2xl object-cover' fill src={el} alt='' sizes="(max-width: 768px) 100vw, 800px" />
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            {bigImg && (
                <BigImg isBigImg={bigImg} isSetBigImg={setBigImg} className='left-0 top-0 w-full h-screen fixed z-[200]'>
                    <Swiper navigation={true} autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }} slidesPerView={1} spaceBetween={10} thumbs={{ swiper: thumbsSwiper }} modules={[FreeMode, Thumbs, Autoplay, Navigation]}>
                        {isImg.map((el, i) => (
                            <SwiperSlide className="" key={i}>
                                <div className='flex justify-center items-center h-screen'>
                                    <Image className="object-contain" src={el} alt='Картинки' width={900} height={1200} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </BigImg>
            )}
        </div>
    )
}