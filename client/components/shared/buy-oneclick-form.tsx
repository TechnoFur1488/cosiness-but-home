"use client"

import React, { useState } from 'react'
import { usePostOrderOneMutation } from '@/store/apiSlice'
import { useParams } from 'next/navigation'
import { IMaskInput } from "react-imask"
import { cn } from '@/lib/utils'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
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
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '../ui/button'
import { Minus, Plus } from 'lucide-react'
import { Successfully } from './state'
import { Checkbox } from '../ui/checkbox'
import Link from 'next/link'
import { ScrollArea } from '../ui/scroll-area'

interface Props {
    isSize: string[]
    isPrice: number
}

export const BuyOneclickForm = ({ isSize, isPrice }: Props) => {
    const router = useParams()
    const productId = Number(router.productId)
    const [postData] = usePostOrderOneMutation()
    const [siccess, setSiccess] = useState(false)
    const [bad, setBad] = useState(false)

    const formSchema = z.object({
        mail: z.string().email({ message: "Некорректная почта" }),
        name: z.string().min(2, { message: "Имя слишком короткое" }),
        adress: z.string().min(3, { message: "Адресс слишком короткий" }),
        phone: z.string().min(18, { message: "Некорректный номер телефона" }),
        delivery: z.enum(["Курьером (по Москве)", "Самовывоз"]),
        pay: z.enum(["Наличными", "Переводом"]),
        size: z.string().min(1, ({ message: "Некорректный размер" })),
        quantity: z.number().min(1, ({ message: "Некорректное количество" })),
        policy: z.boolean().refine(val => val === true, {
            message: "Необходимо подтвердить согласие"
        })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail: "",
            name: "",
            adress: "",
            phone: "",
            delivery: "Курьером (по Москве)",
            pay: "Наличными",
            size: "",
            quantity: 1,
            policy: false
        }
    })


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

            await postData({
                productId,
                newOrder: data
            }).unwrap()

            setSiccess(true)

            setTimeout(() => setSiccess(false), 3000)

        } catch (err) {
            setBad(true)

            setTimeout(() => setBad(false), 3000)

            console.error(err)
        }
    }

    const selectedSize = form.watch("size")
    const quantity = form.watch("quantity")

    const price = () => {
        if (!selectedSize) return 0

        try {
            const [w, l] = selectedSize.split("x").map(Number)
            const squareMeters = w * l
            return (isPrice * squareMeters) * quantity
        } catch (err) {
            console.error("Ошибка расчета цены", err)
            return 0
        }
    }

    const isFormValid = form.formState.isValid;

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger className={"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer"}>Купить в один клик</AlertDialogTrigger>
                <AlertDialogContent className='z-[110] border-1 border-[#6E6E73] w-[95%] max-w-[500px] lg:max-w-[600px] p-4 lg:p-6' >
                    <ScrollArea className={"max-h-150"}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg lg:text-xl font-semibold mb-4">Заполните форму</AlertDialogTitle>
                                    <div className="space-y-4 lg:space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="mail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm lg:text-base">Ваш Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" className="h-10" {...field} />
                                                    </FormControl>
                                                    <FormDescription className="text-xs lg:text-sm">
                                                        На эту почту прийдет информация о покупке (проверьте спам)
                                                    </FormDescription>
                                                    <FormMessage className="text-xs text-red-500" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm lg:text-base">Ваше имя</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" className="h-10" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="adress"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm lg:text-base">Ваш адрес</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' className="h-10" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm lg:text-base">Ваш номер телефона</FormLabel>
                                                    <FormControl>
                                                        <IMaskInput className={cn(
                                                            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm lg:text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                                                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                                        )} mask="+7 (000) 000-00-00" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="size"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm lg:text-base">Размер</FormLabel>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-10">
                                                                <SelectValue placeholder="Выберите размер" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className='z-[150]'>
                                                            {isSize.map((el, i) => (
                                                                <SelectItem key={i} value={el}>
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
                                            name="delivery"
                                            render={({ field }) => (
                                                <FormItem className='py-2 lg:py-4'>
                                                    <FormLabel className="text-sm lg:text-base">Способ доставки</FormLabel>
                                                    <FormControl className='pt-2 lg:pt-3'>
                                                        <RadioGroup className='flex flex-col lg:flex-row lg:justify-between space-y-2 lg:space-y-0' onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormItem className={"flex items-center"}>
                                                                <FormControl>
                                                                    <RadioGroupItem value="Курьером (по Москве)" />
                                                                </FormControl>
                                                                <FormLabel className="text-sm lg:text-base ml-2">Курьером (по Москве)</FormLabel>
                                                            </FormItem>
                                                            <FormItem className='flex items-center'>
                                                                <FormControl>
                                                                    <RadioGroupItem value="Самовывоз" />
                                                                </FormControl>
                                                                <FormLabel className="text-sm lg:text-base ml-2">Самовывоз</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pay"
                                            render={({ field }) => (
                                                <FormItem className='py-2 lg:py-4'>
                                                    <FormLabel className="text-sm lg:text-base">Способ Оплаты</FormLabel>
                                                    <FormControl className='pt-2 lg:pt-3'>
                                                        <RadioGroup className='flex flex-col lg:flex-row lg:justify-between space-y-2 lg:space-y-0' onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormItem className={"flex items-center"}>
                                                                <FormControl>
                                                                    <RadioGroupItem value='Наличными' />
                                                                </FormControl>
                                                                <FormLabel className="text-sm lg:text-base ml-2">Наличными</FormLabel>
                                                            </FormItem>
                                                            <FormItem className={"flex items-center"}>
                                                                <FormControl>
                                                                    <RadioGroupItem value='Переводом' />
                                                                </FormControl>
                                                                <FormLabel className="text-sm lg:text-base ml-2">Переводом</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm lg:text-base">Количество</FormLabel>
                                                    <FormControl className='py-2 lg:py-4'>
                                                        <div className="flex items-center">
                                                            <Button className={"bg-[#E5E5EA] h-8 w-8 text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="button" onClick={() => field.onChange(Math.max(1, field.value - 1))}><Minus className="w-4 h-4" /></Button>
                                                            <span className='px-4 text-sm lg:text-base'>{field.value}</span>
                                                            <Button className={"bg-[#E5E5EA] h-8 w-8 text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="button" onClick={() => field.onChange(Math.max(1, field.value + 1))}><Plus className="w-4 h-4" /></Button>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="policy"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col'>
                                                    <div className='flex items-start'>
                                                        <FormControl className='cursor-pointer mt-1'>
                                                            <Checkbox defaultChecked={false} checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <FormLabel className='pl-2 text-sm lg:text-base'>Соглашаюсь на обработку своих <Link className='text-gray-600 underline' href={"/personal"}>персональных данных</Link></FormLabel>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="text-base lg:text-lg font-medium">
                                            Итого: {price().toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                        </div>
                                    </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-6 lg:mt-8 space-x-2">
                                    <AlertDialogCancel className={"cursor-pointer h-10 text-sm lg:text-base"}>Закрыть</AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={!isFormValid}
                                        type="submit"
                                        className={"bg-[#E5E5EA] h-10 text-sm lg:text-base text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}
                                    >
                                        Отправить
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </ScrollArea>
                </AlertDialogContent>
            </AlertDialog>

            {bad && <Successfully className={"animate-fade-in"} isBad={bad} isSetBad={setBad} isSiccess={siccess} isSetSiccess={setSiccess} />}
            {siccess && <Successfully className={"animate-fade-in"} isBad={bad} isSetBad={setBad} isSiccess={siccess} isSetSiccess={setSiccess} />}
        </>
    )
}
