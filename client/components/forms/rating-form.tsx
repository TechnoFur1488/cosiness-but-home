"use client"

import { z } from 'zod'

export const ratingFormSchema = z.object({
    name: z.string().min(2, { message: "Минимум 2 символа" }),
    grade: z.number().min(1).max(5),
    gradeText: z.string().max(1000, { message: "Максимум 1000 символов" }),
    img: z.custom<FileList>()
        // .refine(files => !files || files.length > 0, "Добавьте хотя бы один файл")
        .refine(files => !files || files.length <= 10, "Максимум 10 файлов")
        .refine(files => !files || Array.from(files).every(file => file.size <= 5_000_000), "Каждый файл должен быть меньше 5MB"),
})

export type RatingFormValues = z.infer<typeof ratingFormSchema>