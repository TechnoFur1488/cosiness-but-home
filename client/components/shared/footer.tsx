"use client"

import { useCallback, useEffect, } from 'react'
import { Container } from './container'
import Link from 'next/link'
import Image from 'next/image'


declare global {
    interface Window {
        ymaps: any
    }
}

export const Footer = () => {

    const initMap = useCallback(() => {
        window.ymaps.ready(() => {
            const map = new window.ymaps.Map("map", {
                center: [55.651584662673315, 37.829109091030226],
                zoom: 15,
                controls: [],
            })
            let placemark = new window.ymaps.Placemark([55.651584662673315, 37.829109091030226], {}, {
                iconLayout: "default#image",
                iconImageHref: "/Frame (2).svg",
                iconImageSize: [30, 30],
            })

            map.controls = [
                'geolocationControl',
                'searchControl',
                'trafficControl',
                'typeSelector',
                'fullscreenControl',
                'zoomControl',
                'rulerControl',
                'routeButtonControl',
                'routePanelControl'
            ]

            map.geoObjects.add(placemark)
        })

    }, [])

    useEffect(() => {
        if (typeof window.ymaps !== "undefined") {
            initMap()
            return
        }

        const script = document.createElement("script")
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=fdd13d6b-859e-4e2c-8186-c730aff6a728&lang=ru_RU"
        script.async = true
        script.addEventListener("load", initMap)

        document.head.appendChild(script)

        return () => {
            script.removeEventListener("load", initMap)
            document.head.removeChild(script)
        }
    }, [initMap])

    return (
        <footer className={"bg-[linear-gradient(to_top,#F8F8F8_80%,#F8F8F8_80%,white_50%,white_50%)] bottom-0 left-0 right-0"}>
            <Container className={'flex justify-between pb-11'}>
                <div id='map' className={"w-[466px] h-[449px]  bg-white "} />
                <div className='pt-[124px] font-medium flex flex-col justify-between'>
                    <h2 className={"text-[32px]"}>Где мы находимся</h2><br />
                    <span className={'text=[20px] '}>МКАД, 14-й километр, 10с2, Москва</span><br />
                    <span className={'text-2xl'}>Свяжитесь с нами </span>
                    <div className={"flex justify-between w-35"}>
                        <Link href={"https://t.me/+79647176716"} target='_blank'>
                            <div className={"flex items-center justify-center w-[55px] h-[55px] rounded-2xl bg-[#D9D9D9]"}>
                                <Image src={"/tg.svg"} alt='Ссылка на телеграм' width={45} height={45} />
                            </div>
                        </Link>
                        <Link href={"https://wa.me/79647176716"} target='_blank'>
                            <div className={"flex items-center justify-center w-[55px] h-[55px] rounded-2xl bg-[#D9D9D9]"}>
                                <Image src={"/wa.svg"} alt='Ссылка на ватсап' width={45} height={45} />
                            </div>
                        </Link>
                    </div>
                    <Link className={"text-2xl"} href={"tel: +7 964 717 67-16"} >+7 964 717 67-16</Link>
                </div>
            </Container>
        </footer>
    )
}