"use client"

import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostRatingMutation } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import { Button } from '../ui/button'
import { Plus, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface Props {
    className?: string
}


export const WriteRating: React.FC<Props> = ({ }) => {
    const router = useParams()
    const productId = Number(router.productId)
    const [postData] = usePostRatingMutation()

    const formSchema = z.object({
        name: z.string().min(2, { message: "Минимум 2 символа" }),
        grade: z.number().min(1).max(5),
        gradeText: z.string().max(1000, { message: "Максимум 1000 символов" }),
        img: z.any().optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            grade: 0,
            gradeText: "",
            img: null,
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            formData.append("name", data.name)
            formData.append("grade", String(data.grade))
            formData.append("productId", String(productId))

            if (data.img) {
                formData.append("img", data.img)
            }
            if (data.gradeText) {
                formData.append("gradeText", data.gradeText)
            }

            await postData(formData).unwrap()
            form.reset
        } catch (err) {
            alert("Вы уже оставили отзыв")
        }
    }

    const isFormValid = form.formState.isValid

    return (
        <AlertDialog>
            <AlertDialogTrigger className={"bg-[#E5E5EA] text-[#6E6E73] rounded-2xl w-[313px] h-[39px] cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>Написать отзыв</AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Напишите отзыв</AlertDialogTitle>
                            <FormField
                                control={form.control}
                                name="grade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Оценка</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((el) => (
                                                    <button
                                                        type="button"
                                                        key={el}
                                                        className="focus:outline-none"
                                                        onClick={() => field.onChange(el)}
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "h-6 w-6",
                                                                el <= field.value
                                                                    ? "text-yellow-400 fill-current"
                                                                    : "text-gray-300"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ваше имя</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gradeText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Напишите отзыв</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Textarea className='resize-none' {...field} maxLength={1000} />
                                                {field.value.length !== 1000 ? <span>{field.value.length}/1000</span> : <span className='text-red-500'>Введенна максимальная длинна отзыва</span>}
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="img"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Фото</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <Input type='file' onChange={e => {
                                                    const file = e.target.files?.[0]
                                                    field.onChange(file || null)
                                                }} />
                                            </div>
                                        </FormControl>
                                        <FormDescription>Максимум 10 фото</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction disabled={!isFormValid} type='submit'>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>

    )
}