"use client"

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Autoplay } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { cn } from '@/lib/utils';

interface Props {
    className?: string
    isImg: Array<string>
}

export const ProductImg: React.FC<Props> = ({ isImg }) => {
    const [playImg, setPlayImg] = useState(false)

    console.log(playImg);
    

    useEffect(() => {
        const handleWindowBlur = () => {
            setPlayImg(false);
        };

        window.addEventListener('blur', handleWindowBlur);

        return () => {
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, []);
    

    return (
        <div onMouseOver={() => setPlayImg(true)} onMouseOut={() => setPlayImg(false)}>
            {playImg ? (
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    className={cn("mySwiper", "max-w-[345px]")}
                    modules={[Autoplay]}
                >
                    {isImg.map((el, i) => (
                        <SwiperSlide key={i}>
                            <Image className={'object-cover rounded-2xl'} src={el} alt={""} width={345} height={345} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <Image className={'rounded-2xl'} src={isImg[0]} alt="" width={345} height={345} />
            )}
        </div>
    )
}