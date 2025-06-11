"use client"

import Link from "next/link"
import { useCallback, useEffect } from "react"
import Image from "next/image"

declare global {
    interface Window {
        ymaps: any
    }
}

export const    Contacts = () => {

    const initMap = useCallback(() => {
        window.ymaps.ready(() => {
            const map = new window.ymaps.Map("map", {
                center: [55.651584662673315, 37.829109091030226],
                zoom: 15,
                controls: []
            })
            let placemark = new window.ymaps.Placemark([55.651584662673315, 37.829109091030226], {}, {
                iconLayout: "default#image",
                iconImageHref: "/Frame (2).svg",
                iconImageSize: [30, 30]
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

        if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
            const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]')
            existingScript?.addEventListener('load', initMap)
            return
        }

        const script = document.createElement("script")
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=fdd13d6b-859e-4e2c-8186-c730aff6a728&lang=ru_RU"
        script.async = true

        script.addEventListener('load', initMap)
        document.head.appendChild(script)

        return () => {
            script.removeEventListener('load', initMap)
        }
    }, [initMap])

    
    return (
        <div className={"space-y-5 my-20"}>
            <h1 className={"font-bold text-[32px]"}>Контакты</h1>
            <div id='map' className={"w-full sm:h-[522px] h-90 bg-white overflow-hidden rounded-2xl shadow"} />
            <Image className={"rounded-2xl shadow"} src={"/photo_2025-06-01_12-48-02.jpg"} alt="картинка" width={1000} height={500} />
            <h2 className={"font-bold text-[22px] mt-"}>Где мы находимся</h2>
            <p>МКАД, 14-й километр, 10с2, место АНК-81</p>
            <h2 className={"font-bold text-[22px]"}>Наши контакты</h2>
            <div className={"flex flex-col space-y-4"}>
                <Link href={"tel: +7 964 717 67-16"} >Телефон: +7 964 717 67-16</Link>
                <Link href={"mailto: cosinessbuthome@gmail.com"}>Email: cosinessbuthome@gmail.com</Link>
            </div>
            <h2 className={"font-bold text-[22px]"}>Наши социальные сети</h2>
            <div className="flex justify-between w-20">
                <Link href={"https://t.me/+79647176716"} target='_blank'>
                    <Image src={"/tg.svg"} alt='Ссылка на телеграм' width={30} height={30} />
                </Link>
                <Link href={"https://wa.me/79647176716"} target='_blank'>
                    <Image src={"/wa.svg"} alt='Ссылка на ватсап' width={30} height={30} />
                </Link>
            </div>
        </div>
    )
}