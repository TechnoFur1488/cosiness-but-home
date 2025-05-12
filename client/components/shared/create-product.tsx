"use client"

import { useCreateProductMutation } from "@/store/apiSlice"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import Image from "next/image"
import { useState } from "react"

const CreateProduct = () => {
    const [postProduct] = useCreateProductMutation()
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    const formSchema = z.object({
        img: z.instanceof(FileList)
            .refine(files => files.length > 0, "Добавьте хотя бы один файл")
            .refine(files => files.length <= 10, "Максимум 10 файлов")
            .refine(files => Array.from(files).every(file => file.size <= 5_000_000), "Каждый файл должен быть меньше 5MB"),
        name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" }),
        price: z.number(),
        discount: z.number(),
        compound: z.string(),
        warp: z.string(),
        hight: z.number(),
        hardness: z.number(),
        size: z.string(),
        description: z.string(),
        catalogId: z.number(),
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
            formData.append("catalogId", String(data.catalogId))

        } catch (err) {
            alert("Не удалось создать товар")
            console.error(err)
        }
    }


    return (
        <div className={""}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="img"
                        render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                                <FormLabel>Фото</FormLabel>
                                <FormControl>
                                    <div>
                                        <Input multiple type="file" {...rest} onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
                                        {previewUrls.map((el: string, i: number) => (
                                            <div key={i}>
                                                <Image src={el} alt="asd" width={100} height={150} />
                                            </div>
                                        ))}
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}

export default CreateProduct