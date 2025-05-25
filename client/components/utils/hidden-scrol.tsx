import { useEffect } from "react"

export const HiddenScrol = (state: boolean) => {
    useEffect(() => {
        if (state) {
            const width = window.innerWidth - document.documentElement.clientWidth
            
            document.body.style.overflow = "hidden"
            document.body.style.paddingRight = `${width}px`
        } else {
            document.body.style.overflow = "auto"
            document.body.style.paddingRight = ""
        }

        return () => {
            document.body.style.overflow = "auto"
            document.body.style.paddingRight = ""
        }
    }, [state])
}