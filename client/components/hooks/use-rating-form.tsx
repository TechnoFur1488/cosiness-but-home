"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RatingFormValues, ratingFormSchema } from '../forms/rating-form'

export const useRatingForm = () => {
    const form = useForm<RatingFormValues>({
        resolver: zodResolver(ratingFormSchema),
        defaultValues: {
            name: "",
            grade: 0,
            gradeText: "",
            img: undefined,
        }
    })

    return { form }
}