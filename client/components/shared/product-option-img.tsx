"use client"

import React, { useEffect, useState } from 'react'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper"
import Image from 'next/image';
import { BigImg } from './big-img';

interface Props {
    className?: string
    isImg: Array<string>
}

export const ProductOptionImg: React.FC<Props> = ({ isImg }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [bigImg, setBigImg] = useState(false)

    console.log(bigImg);

    // useEffect(() => {
    //     if (bigImg) {
    //         const width = window.innerWidth - document.documentElement.clientWidth

    //         document.body.style.overflow = "hidden"
    //         document.body.style.paddingRight = `${width}px`
    //     } else {
    //         document.body.style.overflow = "auto"
    //         document.body.style.paddingRight = ""
    //     }

    //     return () => {
    //         document.body.style.overflow = "auto"
    //         document.body.style.paddingRight = ""
    //     }
    // }, [bigImg])

    return (
        <div className={"w-[463px]"}>
            <Swiper loop={true} className='rounded-2xl' autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }} spaceBetween={30} thumbs={{ swiper: thumbsSwiper }} modules={[FreeMode, Thumbs, Autoplay]}>
                {isImg.map((el, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <button className='cursor-pointer' onClick={e => setBigImg(true)}>
                                <Image className={"rounded-2xl"} src={el} alt='Картинка' width={463} height={463} />
                            </button>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <Swiper className={"flex justify-between items-center mt-5"} onSwiper={setThumbsSwiper} spaceBetween={10} slidesPerView={4} freeMode={true} modules={[FreeMode, Thumbs]}>
                {isImg.map((el, i) => {
                    return (
                        <SwiperSlide key={i}>
                            <Image className='rounded-2xl' src={el} alt='' width={102} height={102} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            {bigImg && (
                <BigImg isBigImg={bigImg} isSetBigImg={setBigImg} className='left-0 top-0 w-full h-screen fixed z-[200]'>
                    <Swiper autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }} slidesPerView={1} spaceBetween={10} thumbs={{ swiper: thumbsSwiper }} modules={[FreeMode, Thumbs, Autoplay]}>
                        {isImg.map((el, i) => (
                            <SwiperSlide className="" key={i}>
                                <div className='flex justify-center items-center h-screen'>
                                    <Image className="object-cover" src={el} alt='Картинки' width={1200} height={1200} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </BigImg>
            )}
        </div>
    )
}