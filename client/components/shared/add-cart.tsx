"use client"

import React from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction
} from "@/components/ui/alert-dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePostCartMutation } from '@/store/apiSlice'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select'
import { Button } from '../ui/button'
import { Minus, Plus } from 'lucide-react'

interface Props {
    isPrice: number
    isSize: string[]
    isId: number
}

export const AddCart = ({ isPrice, isSize, isId }: Props) => {
    const [postCart] = usePostCartMutation()

    const formSchema = z.object({
        size: z.string().min(1, ({ message: "Некорректный размер" })),
        quantity: z.number().min(1, ({ message: "Некорректное количество" })),
        productId: z.number()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            size: "",
            quantity: 1,
            productId: isId
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await postCart({
                newCart: data
            }).unwrap()
        } catch (err) {
            alert("Не смогли добавить в корзину товар")
        }
    }

    const selectedSizes = form.watch("size")
    const quantity = form.watch("quantity")

    const price = () => {
        if (!selectedSizes) return 0

        try {
            const [w, l] = selectedSizes.split("x").map(Number)
            const squareMeters = w * l
            return (isPrice * squareMeters) * quantity
        } catch (err) {
            console.error("Ошибка расчета цены", err)
            return 0
        }
    }

    const isFormValid = form.formState.isValid

    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-full bg-[#EDEDED] rounded-2xl cursor-pointer h-8 hover:bg-[#DBDBDB] transition duration-150">В корзину</AlertDialogTrigger>
            <AlertDialogContent className='z-[110] border-1 border-[#6E6E73]' >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Доболение в корзину</AlertDialogTitle>
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Размеры</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue placeholder="Выбрать размер" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='z-[150]'>
                                                {isSize.map((el, i) => (
                                                    <SelectItem className='w-full' value={el} key={i}>
                                                        {el}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Количество</FormLabel>
                                        <FormControl className='py-4'>
                                            <div>
                                                <Button className={"bg-[#E5E5EA] h-5  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="button" onClick={() => field.onChange(Math.max(1, field.value - 1))}><Minus width={15} height={15} /></Button>
                                                <span className='px-2'>{field.value}</span>
                                                <Button className={"bg-[#E5E5EA] h-5  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="button" onClick={() => field.onChange(Math.max(1, field.value + 1))}><Plus width={25} height={25} /></Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <span>Итого: {price().toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Закрыть</AlertDialogCancel>
                            <AlertDialogAction disabled={!isFormValid} type="submit" className={"bg-[#E5E5EA]  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>Добавить в корзину</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}