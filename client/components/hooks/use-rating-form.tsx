"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RatingFormValues, ratingFormSchema } from '../forms/rating-form'

interface Form {
    isName: string
    isGrade: number
    isGradeText: string
    isImg: undefined
}

export const useRatingForm = (data: Form) => {
    const form = useForm<RatingFormValues>({
        resolver: zodResolver(ratingFormSchema),
        defaultValues: {
            name: data.isName || "",
            grade: data.isGrade || 0,
            gradeText: data.isGradeText || "",
            img: data.isImg || undefined,
        }
    })

    return { form }
}