import { Star } from "lucide-react"

export const GradeRating = (grade: number) => {
    const stars = []

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star
                key={i}
                fill={i <= grade ? 'currentColor' : 'currentColor'}
                className={i <= grade ? 'text-yellow-400' : 'text-gray-300'}
            />
        )
    }
    
    return <div className="flex">{stars}</div>
}