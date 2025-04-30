import { useUpdateRatingMutation } from '@/store/apiSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { Pencil, Star } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface Props {
    isId: number
    isGrade: number
    isName: string
    isGradeText: string
    isImg: Array<string>
}

export const UpdateRating: React.FC<Props> = ({ isId, isGrade, isName, isGradeText, isImg }) => {

    const [updateRating] = useUpdateRatingMutation()

    const formSchema = z.object({
        name: z.string().min(2, { message: "Минимум 2 символа" }),
        grade: z.number().min(1).max(5),
        gradeText: z.string().max(1000, { message: "Максимум 1000 символов" }),
        img: z.instanceof(FileList).optional()
            .refine(files => !files || files.length <= 10, "Максимум 10 изображений")
            .refine(files => {
                if (!files) return true;
                return Array.from(files).every(file => file.size <= 5_000_000)
            }, "Каждое изображение должно быть меньше 5MB"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: isName,
            grade: isGrade,
            gradeText: isGradeText,
            img: undefined
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            formData.append("id", String(isId))
            formData.append("name", data.name)
            formData.append("grade", String(data.grade))

            if (data.img) {
                Array.from(data.img).forEach((file) => {
                    formData.append(`img`, file)
                })
            }
            if (data.gradeText) {
                formData.append("gradeText", data.gradeText)
            }

            await updateRating(formData).unwrap()
        } catch (err) {
            alert("не ваш отзыв")
        }
    }

    const isFormValid = form.formState.isValid

    return (
        <AlertDialog>
            <AlertDialogTrigger className='cursor-pointer ml-3'><Pencil className=' hover:text-green-600 duration-300 transition hover:scale-120' width={20} /></AlertDialogTrigger>
            <AlertDialogContent>
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
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    {...rest}
                                                    onChange={(e) => {
                                                        onChange(e.target.files)
                                                    }}
                                                />
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
                            <AlertDialogAction className={"bg-[#E5E5EA]  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} disabled={!isFormValid} type='submit'>Обновить отзыв</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}