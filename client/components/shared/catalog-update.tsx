"use client"

import { useUpdateCatalogMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import Image from "next/image"
import { Button } from "../ui/button"

interface Props {
    isImg: string[]
    isName: string
    isId: number
}

const formSchema = z.object({
    img: z.instanceof(FileList).optional(),
    name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" })
})

type FormValues = z.infer<typeof formSchema>

export const CatalogUpdate = ({ isImg, isId, isName }: Props) => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>(isImg)
    const [updateCatalog] = useUpdateCatalogMutation()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: isName
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(e.target.files[0])

            form.setValue("img", dataTransfer.files)

            const url = URL.createObjectURL(e.target.files[0])
            setPreviewUrls([url])
        }
    }

    const handleRemoveFile = () => {
        if (previewUrls.length > 0) {
            URL.revokeObjectURL(previewUrls[0])
            setPreviewUrls([])
            form.setValue("img", undefined)
        }
    }

    const onSubmit = async (data: FormValues) => {
        try {
            const formData = new FormData()

            if (data.img) {
                Array.from(data.img).forEach(file => {
                    formData.append("img", file)
                })
            }
            formData.append("id", String(isId))
            formData.append("name", data.name)
            formData.append("existingImg", JSON.stringify(existingImages))

            await updateCatalog(formData).unwrap()
            form.reset()
        } catch (err) {
            alert("Не удалось обновить каталог")
            console.error(err)
        }
    }

    useEffect(() => {
        setExistingImages(isImg)
    }, [isImg])

    const handleRemoveExistingImage = () => {
        setExistingImages([])
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className='cursor-pointer'>
                <Pencil fill='white' className='hover:text-green-600 duration-300 transition hover:scale-120' width={20} />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <ScrollArea className={"max-h-[80vh]"}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Что вы хотите изменить?</AlertDialogTitle>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Новое название каталога</FormLabel>
                                            <FormControl>
                                                <Input type='text' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="img"
                                    render={({ field: { value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel>Фото</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    {existingImages.length > 0 && (
                                                        <div className={"relative w-fit"}>
                                                            <div className={"relative w-100 h-100 flex items-center justify-center"}>
                                                                <Image
                                                                    className={"object-cover rounded-2xl"}
                                                                    src={existingImages[0]}
                                                                    alt="Текущее изображение каталога"
                                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                    fill
                                                                />
                                                            </div>
                                                            <button
                                                                type='button'
                                                                onClick={handleRemoveExistingImage}
                                                                className={"absolute right-1 top-1"}
                                                            >
                                                                <Trash2
                                                                    color='black'
                                                                    fill='currentColor'
                                                                    className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'}
                                                                />
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <Input
                                                            type="file"
                                                            {...rest}
                                                            onChange={handleFileChange}
                                                            accept="image/*,.png,.jpg,.web"
                                                        />
                                                    </div>

                                                    {previewUrls.length > 0 && (
                                                        <div className={"relative w-fit"}>
                                                            <div className={"relative w-100 h-100 flex items-center justify-center"}>
                                                                <Image
                                                                    className={"object-cover rounded-2xl"}
                                                                    src={previewUrls[0]}
                                                                    alt="Новое изображение каталога"
                                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                                    fill
                                                                />
                                                            </div>
                                                            <button
                                                                type='button'
                                                                onClick={handleRemoveFile}
                                                                className={"absolute right-1 top-1"}
                                                            >
                                                                <Trash2
                                                                    color='black'
                                                                    fill='currentColor'
                                                                    className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'}
                                                                />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Закрыть</AlertDialogCancel>
                                <AlertDialogAction
                                    className={"bg-[#E5E5EA] text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}
                                    type='submit'
                                >Обновить каталог</AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </AlertDialogContent>
        </AlertDialog>
    )
}