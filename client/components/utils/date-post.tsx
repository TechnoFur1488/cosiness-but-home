export const DatePost = (component: string) => {
    let options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    return new Date(component).toLocaleString("ru-RU", options)
}