"use client"

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
import { usePostRatingMutation } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import { Star, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import Image from 'next/image'
import { RatingFormValues } from '../forms/rating-form'
import { useRatingForm } from '../hooks/use-rating-form'
import { useState } from "react"
import { ScrollArea } from "../ui/scroll-area"

export const WriteRating = () => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const router = useParams()
    const productId = Number(router.productId)
    const [postData] = usePostRatingMutation()
    const { form } = useRatingForm({
        isName: "",
        isGrade: 0,
        isGradeText: "",
        isImg: undefined
    })

    const onSubmit = async (data: RatingFormValues) => {
        try {
            const formData = new FormData()
            formData.append("name", data.name)
            formData.append("grade", String(data.grade))
            formData.append("productId", String(productId))
            formData.append("gradeText", data.gradeText)

            if (data.img) {
                Array.from(data.img).forEach((file) => {
                    formData.append(`img`, file)
                })
            }

            await postData(formData).unwrap()
            form.reset()
            setPreviewUrls([])
        } catch (err) {
            alert("Вы уже оставили отзыв")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            form.setValue("img", e.target.files)

            const files = Array.from(e.target.files)
            const urls = files.map(file => URL.createObjectURL(file))
            setPreviewUrls(urls)
        }
    }

    const handleRemoveFile = (index: number) => {
        const newUrls = [...previewUrls]
        URL.revokeObjectURL(newUrls[index])
        newUrls.splice(index, 1)
        setPreviewUrls(newUrls)

        const currentFiles = form.getValues("img")

        if (currentFiles && currentFiles.length > 0) {
            const files = Array.from(currentFiles)
            files.splice(index, 1)

            const dataTransfer = new DataTransfer()
            files.forEach(file => dataTransfer.items.add(file))

            form.setValue("img", dataTransfer.files)
        }
    }

    const isFormValid = form.formState.isValid

    return (
        <AlertDialog>
            <AlertDialogTrigger className={"bg-[#E5E5EA] text-[#6E6E73] rounded-2xl w-[313px] h-[39px] cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>Написать отзыв</AlertDialogTrigger>
            <AlertDialogContent>
                <ScrollArea className={"max-h-200"}>
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
                                                <div>
                                                    {[1, 2, 3, 4, 5].map((el) => (
                                                        <button
                                                            type="button"
                                                            key={el}
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
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>Фото</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <Input multiple type="file" {...rest} onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
                                                    <div className={"grid grid-cols-3 gap-x-5 gap-y-5 my-5"}>
                                                        {previewUrls.map((el: string, i: number) => (
                                                            <div key={i} className={"flex w-30 relative"}>
                                                                <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={el} alt="Ваша картинка с отзывами" width={120} height={190} />
                                                                <button onClick={() => handleRemoveFile(i)} className={"cursor-pointer absolute right-1 top-1"}>
                                                                    <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                {value?.length
                                                    ? `Выбрано ${value.length} файлов (максимум 10)`
                                                    : "Максимум 10 фото"}
                                            </FormDescription>
                                            {form.formState.errors.img && (
                                                <p className="text-red-500 text-sm">
                                                    {form.formState.errors.img.message}
                                                </p>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Вернуться</AlertDialogCancel>
                                <AlertDialogAction
                                    className={"bg-[#E5E5EA] text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}
                                    disabled={!isFormValid}
                                    type='submit'
                                >
                                    Отправить отзыв
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </AlertDialogContent>
        </AlertDialog>
    )
}