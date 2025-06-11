import { useUpdateRatingMutation } from '@/store/apiSlice'
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
import { Pencil, Star, Trash2 } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useRatingForm } from '../hooks/use-rating-form'
import { RatingFormValues } from '../forms/rating-form'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'

interface Props {
    isId: number
    isGrade: number
    isName: string
    isGradeText: string
    isImg: string[]
}

export const UpdateRating = ({ isId, isGrade, isName, isGradeText, isImg, }: Props) => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>(isImg)
    const [updateRating] = useUpdateRatingMutation()
    const { form } = useRatingForm({
        isName: isName,
        isGrade: isGrade,
        isGradeText: isGradeText,
        isImg: undefined
    })

    const onSubmit = async (data: RatingFormValues) => {
        try {
            const formData = new FormData()

            formData.append("id", String(isId))
            formData.append("name", data.name)
            formData.append("grade", String(data.grade))
            formData.append("gradeText", data.gradeText)
            formData.append("existingImg", JSON.stringify(existingImages))

            if (data.img) {
                Array.from(data.img).forEach((file) => {
                    formData.append(`img`, file)
                })
            }

            await updateRating(formData).unwrap()
        } catch (err) {
            alert("не ваш отзыв")
        }
    }

    useEffect(() => {
        setExistingImages(isImg)
    }, [setExistingImages, isImg])

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(prev => {
            const newImg = [...prev]
            newImg.splice(index, 1)
            return newImg
        })

    }


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const currentFiles = form.getValues("img") || new DataTransfer().files
            const dataTransfer = new DataTransfer()

            if (currentFiles) {
                Array.from(currentFiles).forEach(file => dataTransfer.items.add(file))
            }

            Array.from(e.target.files).forEach(file => dataTransfer.items.add(file))

            form.setValue("img", dataTransfer.files)

            const newUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file))
            setPreviewUrls(prev => [...prev, ...newUrls])
        }
    }

    const handleRemoveFile = (index: number) => {
        setPreviewUrls(prev => {
            const newUrls = [...prev]
            URL.revokeObjectURL(newUrls[index])
            newUrls.splice(index, 1)
            return newUrls
        })

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
            <AlertDialogTrigger className='cursor-pointer'><Pencil className=' hover:text-green-600 duration-300 transition hover:scale-120' width={20} /></AlertDialogTrigger>
            <AlertDialogContent>
                <ScrollArea className={"max-h-200"}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Что вы хотите изменить?</AlertDialogTitle>
                                <FormField
                                    control={form.control}
                                    name='grade'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Оценка</FormLabel>
                                            <FormControl>
                                                <div>
                                                    {[1, 2, 3, 4, 5].map((el) => (
                                                        <button
                                                            type='button'
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
                                    name='name'
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
                                    name='gradeText'
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
                                                    <div className={"grid grid-cols-3 gap-x-5 gap-y-5 my-5"}>
                                                        {existingImages.map((el, i) => (
                                                            <div key={i} className={"flex w-30 relative"}>
                                                                <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={el} alt="Ваша картинка с отзывами" width={120} height={190} />
                                                                <button type='button' onClick={() => handleRemoveExistingImage(i)} className={"cursor-pointer absolute right-1 top-1"}>
                                                                    <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span>Добавить фото</span>
                                                    <Input multiple type="file" {...rest} onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
                                                    <div className={"grid grid-cols-3 gap-x-5 gap-y-5 my-5"}>
                                                        {previewUrls.map((el: string, i: number) => (
                                                            <div key={i} className={"flex w-30 relative"}>
                                                                <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={el} alt="Ваша картинка с отзывами" width={120} height={190} />
                                                                <button type='button' onClick={() => handleRemoveFile(i)} className={"cursor-pointer absolute right-1 top-1"}>
                                                                    <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                {value?.length
                                                    ? `Всего ${(value?.length || 0)} файлов (максимум 10)`
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
                                <AlertDialogCancel >Вернуться</AlertDialogCancel>
                                <AlertDialogAction
                                    className={"bg-[#E5E5EA] text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}
                                    disabled={!isFormValid}
                                    type='submit'
                                >Обновить отзыв</AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </AlertDialogContent>
        </AlertDialog >
    )
}