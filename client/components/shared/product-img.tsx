import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'
import { Autoplay } from 'swiper/modules'
import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Props {
    className?: string
    isImg: string[]
}

export const ProductImg: React.FC<Props> = ({ isImg, className }) => {
    return (
        <div className={cn("relative w-[345px] h-[430px]", className)}>
            <Image src={isImg[0]} alt="Main product image" fill className={"object-cover rounded-2xl hover:opacity-0 relative z-20"} sizes="(max-width: 768px) 100vw, 345px" priority />
            <Swiper spaceBetween={30} centeredSlides={true} loop={true} autoplay={{ delay: 2000, disableOnInteraction: false, }} className="w-full h-[430px] rounded-2xl" modules={[Autoplay]}>
                {isImg.map((el, i) => (
                    <SwiperSlide key={i} className="!h-full">
                        <div className="relative z-10 w-full h-full">
                            <Image src={el} alt="Product image" fill className="object-cover rounded-2xl" sizes="(max-width: 768px) 100vw, 345px" priority={i === 0} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}