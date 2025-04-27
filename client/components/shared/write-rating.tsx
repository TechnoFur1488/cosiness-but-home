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
    const [fileInputs, setFileInputs] = useState([0])


    const addFileInput = () => {
        setFileInputs([...fileInputs, fileInputs.length])
    }

    const formSchema = z.object({
        name: z.string().min(2, { message: "Минимум 2 символа" }),
        grade: z.number().min(1).max(5),
        gradeText: z.string().max(1000, { message: "Максимум 1000 символов" }),
        
        img: z.array(z.string()),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            grade: 0,
            gradeText: "",
            img: [],
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

            await postData({
                productId,
                newRating: data
            }).unwrap()

        } catch (err) {
            console.error(err)
        }
    }

    const isFormValid = form.formState.isValid

    return (
        <AlertDialog>
            <AlertDialogTrigger className={"cursor-pointer"}>Написать отзыв</AlertDialogTrigger>
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
                                            <Textarea className='resize-none' {...field} />
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
                                                {fileInputs.map((inputKey) => (
                                                    <div key={inputKey} className="flex items-center gap-2">
                                                        <Input
                                                            type="file"
                                                            onChange={(e) => {
                                                                const files = e.target.files
                                                                if (files && files.length > 0) {
                                                                    field.onChange([
                                                                        ...(field.value || []),
                                                                        files[0]
                                                                    ])
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                                <Button
                                                    type="button"
                                                    onClick={addFileInput}
                                                    variant="outline"
                                                    size="icon"
                                                    disabled={fileInputs.length >= 10}
                                                    className='w-full'
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
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