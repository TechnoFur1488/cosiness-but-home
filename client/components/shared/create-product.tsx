"use client"

import { useCreateProductMutation } from "@/store/apiSlice"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import Image from "next/image"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { CatalogSelect } from "./catalog-select"

export const CreateProduct = () => {
    const [postProduct] = useCreateProductMutation()
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    const formSchema = z.object({
        img: z.instanceof(FileList)
            .refine(files => files.length > 0, "Добавьте хотя бы один файл")
            .refine(files => files.length <= 10, "Максимум 10 файлов")
            .refine(files => Array.from(files).every(file => file.size <= 5_000_000), "Каждый файл должен быть меньше 5MB"),
        name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" }),
        price: z.coerce.number().min(1, { message: "Цена должна быть больше 0" }),
        discount: z.coerce.number(),
        compound: z.string().min(2, { message: "Состав должен быть не меньше 2 символов" }),
        warp: z.string().min(2, { message: "Основа должна быть не меньше 2 символов" }),
        hight: z.coerce.number().min(0.1, { message: "Высота должна быть больше 0.1" }),
        hardness: z.coerce.number().min(1, { message: "Твердость должна быть больше01" }),
        size: z.string().min(2, { message: "Размер должен быть не меньше 2 символов" }),
        description: z.string().min(2, { message: "Описание должно быть не меньше 2 символов" }),
        from: z.string().min(2, { message: "Производитель должен быть не меньше 2 символов" }),
        catalogId: z.coerce.number().min(1, { message: "Категория должна быть больше 0" }),
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            img: undefined,
            name: "",
            price: 0,
            discount: 0,
            compound: "",
            warp: "",
            hight: 0,
            hardness: 0,
            size: "",
            description: "",
            from: "",
            catalogId: 0
        }
    })

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

        if (form.getValues("img")) {
            const files = Array.from(form.getValues("img"))
            files.splice(index, 1)

            const dataTransfer = new DataTransfer()
            files.forEach(file => dataTransfer.items.add(file))

            form.setValue("img", dataTransfer.files)
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()

            Array.from(data.img).forEach((file) => {
                formData.append("img", file)
            })
            formData.append("name", data.name)
            formData.append("price", String(data.price))
            formData.append("discount", String(data.discount))
            formData.append("compound", data.compound)
            formData.append("warp", data.warp)
            formData.append("hight", String(data.hight))
            formData.append("hardness", String(data.hardness))
            formData.append("size", data.size)
            formData.append("description", data.description)
            formData.append("from", data.from)
            formData.append("catalogId", String(data.catalogId))

            await postProduct(formData).unwrap()

            form.reset()
        } catch (err) {
            alert("Не удалось создать товар")
            console.error(err)
        }
    }


    return (
        <div className={"w-[50%]"}>
            <h2 className={"font-medium text-2xl mb-5"}>Создать товар</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="img"
                        render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Фото</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input multiple type="file" {...rest} onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
                                        <div className={"grid grid-cols-5 gap-x-5 gap-y-10 my-5"}>
                                            {previewUrls.map((el: string, i: number) => (
                                                <div key={i} className={"flex w-30 relative"}>
                                                    <Image className={"object-cover rounded-2xl min-h-[190px] max-h-[190px]"} src={el} alt="asd" width={120} height={190} />
                                                    <button onClick={() => handleRemoveFile(i)} className={"cursor-pointer absolute right-1 top-1"}>
                                                        <Trash2 color='black' fill='currentColor' className={'hover:text-red-600 duration-300 transition hover:scale-120 text-[#E5E5EA]'} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <span>{previewUrls.length === 0 ? "Файлы не выбраны" : `файлов  выбрано ${previewUrls.length}`}</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите название товара</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите цену</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите бывшую цену</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="compound"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите состав</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="warp"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите основу ковра</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hight"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите высоту</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hardness"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите плотность</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите размер</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите описание</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Введите страну</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="catalogId"
                        render={({ field }) => (
                            <FormItem className={"mb-5"}>
                                <FormLabel>Выберите каталог</FormLabel>
                                <FormControl>
                                    <CatalogSelect 
                                        value={field.value?.toString()} 
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Создать</Button>
                </form>
            </Form>
        </div>
    )
}
