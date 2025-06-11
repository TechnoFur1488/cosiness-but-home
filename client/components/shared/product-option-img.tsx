"use client"

import React, { useEffect, useState } from 'react'

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/grid';
import { Thumbs, Autoplay, Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from "swiper"
import Image from 'next/image';
import { BigImg } from './big-img';
import { Navigation } from 'swiper/modules';
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';

interface Props {
    isImg: string[]
    isEdit: boolean
    editImage: File[]
    setEditImage: React.Dispatch<React.SetStateAction<File[]>>
    isExistingImages: string[]
    isSetExistingImages: React.Dispatch<React.SetStateAction<string[]>>
}

export const ProductOptionImg = ({ isImg, isEdit, editImage, setEditImage, isExistingImages, isSetExistingImages }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [bigImg, setBigImg] = useState(false)
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    useEffect(() => {
        isSetExistingImages(isImg)
    }, [isSetExistingImages, isImg])

    useEffect(() => {
        return () => {
            if (thumbsSwiper && !thumbsSwiper.destroyed) {
                thumbsSwiper.destroy();
            }
        };
    }, [thumbsSwiper])

    const handleRemoveExistingImage = (index: number) => {
        isSetExistingImages(prev => {
            const newImg = [...prev]
            newImg.splice(index, 1)
            return newImg
        })

    }

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
        <div>
            {isEdit
                ?
                <>
                    <div className={"grid grid-cols-4 gap-x-5 gap-y-10 my-5"}>
                        {isExistingImages.map((el: string, i: number) => (
                            <div key={i} className={"flex w-30 relative"}>
                                <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={el} alt="asd" width={120} height={190} />
                                <button onClick={() => handleRemoveExistingImage(i)} className={"cursor-pointer absolute right-1 top-1"}>
                                    <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <span>Добавить фото</span>
                    <Input type='file' multiple onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
                    <div className={"grid grid-cols-4 gap-x-5 gap-y-10 my-5"}>
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
                    <div className={"flex gap-1"}>
                        <Swiper
                            loop={true}
                            className={'rounded-2xl w-[500px]'}
                            autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                            spaceBetween={30}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[Thumbs, Autoplay]}
                        >
                            {isImg.map((el, i) => (
                                <SwiperSlide key={i}>
                                    <div className={"relative sm:h-[400px] md:h-[550px] lg:h-[700px] h-[250px] object-cover"}>
                                        <button onClick={() => setBigImg(true)}>
                                            <Image
                                                className={"rounded-2xl"}
                                                fill
                                                src={el}
                                                alt='Основное изображение'
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </button>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            spaceBetween={10}
                            slidesPerView={2}
                            slidesPerGroup={2}
                            grid={{
                                rows: 2
                            }}
                            modules={[Grid, Thumbs]}
                            watchSlidesProgress={true}
                            className="w-[500px] sm:h-[400px] md:h-[550px] h-[250px] lg:h-[700px]"
                        >
                            {isImg.map((el, i) => (
                                <SwiperSlide key={i}>
                                    <div className="relative h-full cursor-pointer">
                                        <Image
                                            className="rounded-2xl object-cover hover:opacity-80 transition-opacity"
                                            fill
                                            src={el}
                                            alt='Миниатюра'
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>


                    {bigImg && (
                        <BigImg isBigImg={bigImg} isSetBigImg={setBigImg} className='left-0 top-0 w-full h-screen fixed z-[200]'>
                            <div className="h-full w-full flex items-center justify-center">
                                <Swiper className={"max-w-[1000px] lg:h-[1200px] h-150 rounded-2xl"} slidesPerView={1} spaceBetween={30} modules={[Navigation]}>
                                    {isImg.map((el, i) => (
                                        <SwiperSlide className="flex items-center justify-center rounded-2xl" key={i}>
                                            <div className='lg:h-[1200px] h-150 lg:w-[1000px] w-100 relative'>
                                                <Image className="object-cover rounded-2xl" src={el} alt='Картинки' fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </BigImg>
                    )}
                </>
            }
        </div >
    )
}