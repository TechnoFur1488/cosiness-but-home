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
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';

interface Props {
    isImg: Array<string>
    isEdit: boolean
    editImage: File[]
    setEditImage: React.Dispatch<React.SetStateAction<File[]>>
}

export const ProductOptionImg = ({ isImg, isEdit, editImage, setEditImage }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [bigImg, setBigImg] = useState(false)
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setEditImage(files)

            const urls = files.map(file => URL.createObjectURL(file))
            setPreviewUrls(urls)
        }
    }

    const handleRemoveFile = (index: number) => {
        URL.revokeObjectURL(previewUrls[index])

        const newFiles = [...editImage]
        const newUrls = [...previewUrls]

        newFiles.splice(index, 1)
        newUrls.splice(index, 1)

        setEditImage(newFiles)
        setPreviewUrls(newUrls)

    }

    return (
        <div className={"w-[463px]"}>
            {isEdit
                ?
                <>
                    <Input type='file' multiple onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
                    <div className={"grid grid-cols-3 gap-x-5 gap-y-10 my-5"}>
                        {previewUrls.map((el: string, i: number) => (
                            <div key={i} className={"flex w-30 relative"}>
                                <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={el} alt="asd" width={120} height={190} />
                                <button onClick={() => handleRemoveFile(i)} className={"cursor-pointer absolute right-1 top-1"}>
                                    <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
                :
                <>
                    <Swiper
                        loop={true}
                        className={'rounded-2xl h-[550px]'}
                        autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        spaceBetween={30}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        modules={[FreeMode, Thumbs, Autoplay]}
                    >
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
                    <Swiper
                        className={"flex justify-between items-center mt-5 h-[122px]"}
                        onSwiper={(swiper) => {
                            if (swiper && !swiper.destroyed) {
                                setThumbsSwiper(swiper);
                            }
                        }}
                        spaceBetween={10}
                        slidesPerView={4}
                        freeMode={true}
                        modules={[FreeMode, Thumbs]}
                    >
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
                </>
            }
        </div>
    )
}