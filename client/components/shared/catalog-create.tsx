import { useCreateCatalogMutation } from "@/store/apiSlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"

export const CatalogCreate = () => {
    const [postCatalog] = useCreateCatalogMutation()
    const [previewUrls, setPreviewUrls] = useState<string[]>([])

    const formSchema = z.object({
        img: z.instanceof(FileList),
        name: z.string().min(2, { message: "Имя должно быть не меньше 2 символов" }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            img: undefined,
            name: "",
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

            await postCatalog(formData).unwrap()

            form.reset()
        } catch (err) {
            alert("Не удалось создать товар")
            console.error(err)
        }
    }


    return (
        <div className={"mt-20 space-y-10"}>
            <h2>Создание каталога</h2>
            <div className={"bg-white p-3 shadow rounded-2xl"}>
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
                                            <Input type="file" {...rest} onChange={handleFileChange} accept="image/*,.png,.jpg,.web" />
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
                                <FormItem className={"mb-3"}>
                                    <FormLabel>Введите название товара</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Создать</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}