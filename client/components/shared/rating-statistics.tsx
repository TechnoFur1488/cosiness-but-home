import { useGetRatingQuery } from "@/store/apiSlice"
import { ParamValue } from "next/dist/server/request/params"
import { GradeRating } from "../utils"
import { Progress } from "../ui/progress"
import { RatingStatisticsLoading } from "../status/rating-statistics-loading"

interface Props {
    productId: ParamValue
}

export const RatingStatistics = ({ productId }: Props) => {
    const { data, isLoading, isError } = useGetRatingQuery(Number(productId))

    if (isLoading) return <RatingStatisticsLoading />
    if (isError) return <h1>Ошибка</h1>
    if (!data) return <h1>Нету отзывов</h1>

    const averageRating = data.rating.reduce((sum, el) => sum + el.grade, 0) / data.rating.length

    const calculateRating = () => {
        const ratingCounts = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }

        data.rating.forEach(review => {
            if (review.grade >= 1 && review.grade <= 5) {
                ratingCounts[review.grade as keyof typeof ratingCounts]++
            }
        })

        const totalReviews = data.rating.length
        return {
            5: (ratingCounts[5] / totalReviews) * 100,
            4: (ratingCounts[4] / totalReviews) * 100,
            3: (ratingCounts[3] / totalReviews) * 100,
            2: (ratingCounts[2] / totalReviews) * 100,
            1: (ratingCounts[1] / totalReviews) * 100
        }
    }

    const ratingParcentags = calculateRating()

    return (
        <>
            <div className='flex flex-col space-y-2'>
                {averageRating ? <span className={"font-extrabold text-4xl"}>{averageRating.toFixed(1)}</span> : <span className={"font-extrabold text-4xl"}>Отзывов пока что нет</span>}
                <div>
                    {GradeRating(averageRating)}
                </div>
                <span className={"font-light"}>{data.rating.length > 4 ? `${data.rating.length} отзывов` : `${data.rating.length} отзыва`}</span>
            </div>
            <div className={"w-85"}>
                <div className={"flex items-center space-x-3"}>
                    <span className={"w-2"}>5</span>
                    <Progress className={"w-62"} value={ratingParcentags[5]} />
                    <span className="text-sm text-gray-500">{Math.round(ratingParcentags[5])}%</span>
                </div>
                <div className={"flex items-center space-x-3"}>
                    <span className={"w-2"}>4</span>
                    <Progress className={"w-62"} value={ratingParcentags[4]} />
                    <span className="text-sm text-gray-500">{Math.round(ratingParcentags[4])}%</span>
                </div>
                <div className={"flex items-center space-x-3"}>
                    <span className={"w-2"}>3</span>
                    <Progress className={"w-62"} value={ratingParcentags[3]} />
                    <span className="text-sm text-gray-500">{Math.round(ratingParcentags[3])}%</span>
                </div>
                <div className={"flex items-center space-x-3"}>
                    <span className={"w-2"}>2</span>
                    <Progress className={"w-62"} value={ratingParcentags[2]} />
                    <span className="text-sm text-gray-500">{Math.round(ratingParcentags[2])}%</span>
                </div>
                <div className={"flex items-center space-x-3"}>
                    <span className={"w-2"}>1</span>
                    <Progress className={"w-62"} value={ratingParcentags[1]} />
                    <span className="text-sm text-gray-500">{Math.round(ratingParcentags[1])}%</span>
                </div>
            </div>
        </>
    )
}