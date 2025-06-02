import { useLazyGetRatingLazyQuery } from "@/store/apiSlice"
import { useEffect } from "react"
import { DatePost, GradeRating } from "../utils"
import { Trash2, User } from "lucide-react"
import Image from "next/image"
import { UpdateRating } from "./update-rating"
import { cn } from "@/lib/utils"
import { useTokenDecryptor } from "../hooks/use-token-decryptor"
import { ParamValue } from "next/dist/server/request/params"
import { RatingLoading } from "../status/rating-loading"

interface Props {
    productId: ParamValue
    setBigRating: React.Dispatch<React.SetStateAction<boolean>>
    setRatingId: React.Dispatch<React.SetStateAction<number>>
    maxLengthText: (text: string) => string
    handleDelete: (id: number) => void
}

interface Rating {
    id: number
    name: string
    grade: number
    gradeText: string
    img: string[]
    productId: number
    createdAt: string
}

export const RatingProduct = ({ productId, setBigRating, setRatingId, maxLengthText, handleDelete }: Props) => {
    const [trigger, { data, isLoading, isError }] = useLazyGetRatingLazyQuery()
    const role = useTokenDecryptor()

    useEffect(() => {
        trigger({ productId: Number(productId), offset: 0 })
    }, [productId, trigger])

    if (isLoading) return <RatingLoading />
    if (isError) return <h1>Ошибка</h1>

    return (
        <>
            {data?.ratings?.map((el: Rating) => (
                <div key={el.id} className={"bg-white p-3 rounded-2xl shadow flex justify-between"}>
                    <div className={"space-y-2 cursor-pointer"} onClick={() => {
                        if (el.gradeText.length > 200 || el.img.length > 0) {
                            setBigRating(true), setRatingId(el.id)
                        }
                    }}>
                        <div className={"flex items-center space-x-3"}>
                            <div className={"bg-gray-200 rounded-3xl w-10 h-10 flex justify-center items-center shadow"}>
                                <User />
                            </div>
                            <div className={"flex flex-col"}>
                                <span className={"font-medium"}>{el.name}</span>
                                <span className={"font-light text-sm"}>{DatePost(el.createdAt)}</span>
                            </div>
                        </div>
                        <div>
                            {GradeRating(el.grade)}
                        </div>
                        <p className={"font-light"}>{maxLengthText(el.gradeText)}</p>
                        {el.img.length > 0 &&
                            <div className={"flex relative w-[110px] h-[150px]"}>
                                {el.img.slice(0, 3).map((el, i) => (
                                    <div className={cn("absolute shadow w-[110px] h-[150px]", {
                                        "left-0 z-30": i === 0,
                                        "left-6 z-20": i === 1,
                                        "left-12 z-10": i === 2,
                                    })} key={i}>
                                        <Image className={"rounded-2xl"} src={el} alt={el} fill sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                    {role === "ADMIN" &&
                        <div className={"space-x-3 min-w-15"}>
                            <UpdateRating isImg={el.img} isName={el.name} isGrade={el.grade} isGradeText={el.gradeText} isId={el.id} />
                            <button className={"cursor-pointer"} onClick={() => handleDelete(el.id)}>
                                <Trash2 className='hover:text-red-600 duration-300 transition hover:scale-120' width={20} />
                            </button>
                        </div>
                    }
                </div>
            ))}
        </>
    )
}