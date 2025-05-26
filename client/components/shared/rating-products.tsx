import { useGetRatingQuery } from "@/store/apiSlice"
import Image from "next/image"

interface Props {
    isId: number
}

export const RatingProducts = ({ isId }: Props) => {
    const { data, isLoading, isError } = useGetRatingQuery(isId)

    if (isLoading) return <h1>Загрузка...</h1>
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Отзывов нету</h1>

    const averageRating = data.rating.reduce((sum, el) => sum + el.grade, 0) / data.rating.length

    let srcImageStar: string

    if (averageRating >= 4.5) {
        srcImageStar = "/Vector (2).svg"
    } else if (averageRating >= 3.75) {
        srcImageStar = "/Group 69.svg"
    } else if (averageRating >= 2.5) {
        srcImageStar = "/Group 67.svg"
    } else {
        srcImageStar = "/Group 68.svg"
    }

    return (
        <>
            {averageRating > 0 &&
                <div className={"flex"}>
                    <Image src={srcImageStar} alt="Star" width={20} height={20} />
                    <span className={"pl-1"}>{averageRating.toFixed(1)}</span>
                </div>
            }
        </>
    )
}