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
                <AlertDialogTrigger className={"bg-[#E5E5EA] text-[#6E6E73] rounded-2xl w-[313px] h-[39px] cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>Купить в один клик</AlertDialogTrigger>
                <AlertDialogContent className='z-[110] border-1 border-[#6E6E73]' >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Заполните форму</AlertDialogTitle>
                                <FormField
                                    control={form.control}
                                    name="mail"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel>Ваш Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormDescription>
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
                                            <FormLabel>Ваше имя</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
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
                                            <FormLabel>Ваш адрес</FormLabel>
                                            <FormControl>
                                                <Input type='text' {...field} />
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
                                            <FormLabel>Ваш номер телефона</FormLabel>
                                            <FormControl>
                                                <IMaskInput className={cn(
                                                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
                                            <FormLabel>Размер</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
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
                                        <FormItem className='py-4'>
                                            <FormLabel>Способ доставки</FormLabel>
                                            <FormControl className='pt-3'>
                                                <RadioGroup className='flex justify-between' onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormItem className={"flex items-center "}>
                                                        <FormControl>
                                                            <RadioGroupItem value="Курьером (по Москве)" />
                                                        </FormControl>
                                                        <FormLabel>Курьером (по Москве)</FormLabel>
                                                    </FormItem>
                                                    <FormItem className='flex items-center'>
                                                        <FormControl>
                                                            <RadioGroupItem value="Самовывоз" />
                                                        </FormControl>
                                                        <FormLabel>Самовывоз</FormLabel>
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
                                        <FormItem className='py-4'>
                                            <FormLabel>Способ Оплаты</FormLabel>
                                            <FormControl className='pt-3'>
                                                <RadioGroup className='flex justify-between' onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormItem className={"flex items-center"}>
                                                        <FormControl>
                                                            <RadioGroupItem value='Наличными' />
                                                        </FormControl>
                                                        <FormLabel>Наличными</FormLabel>
                                                    </FormItem>
                                                    <FormItem className={"flex items-center "}>
                                                        <FormControl>
                                                            <RadioGroupItem value='Переводом' />
                                                        </FormControl>
                                                        <FormLabel>Переводом</FormLabel>
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
                                            <FormLabel>Количество</FormLabel>
                                            <FormControl className='py-4'>
                                                <div>
                                                    <Button className={"bg-[#E5E5EA] h-5  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="button" onClick={() => field.onChange(Math.max(1, field.value - 1))}><Minus width={15} height={15} /></Button>
                                                    <span className='px-2'>{field.value}</span>
                                                    <Button className={"bg-[#E5E5EA] h-5  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="button" onClick={() => field.onChange(Math.max(1, field.value + 1))}><Plus width={25} height={25} /></Button>
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
                                            <div className='flex'>
                                                <FormControl className='cursor-pointer'>
                                                    <Checkbox defaultChecked={false} checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className='pl-1 flex items-center'>Соглашаюсь на обработку своих<Link className=' text-gray-600 underline' href={"/personal"}>персональных данных</Link></FormLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <span>Итого: {price().toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className={"cursor-pointer"}>Закрыть</AlertDialogCancel>
                                <AlertDialogAction disabled={!isFormValid} type="submit" className={"bg-[#E5E5EA]  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"}>Отправить</AlertDialogAction>
                            </AlertDialogFooter>
                        </form >
                    </Form >
                </AlertDialogContent>
            </AlertDialog >

            {bad && <Successfully className={"animate-fade-in"} isBad={bad} isSetBad={setBad} isSiccess={siccess} isSetSiccess={setSiccess} />}
            {siccess && <Successfully className={"animate-fade-in"} isBad={bad} isSetBad={setBad} isSiccess={siccess} isSetSiccess={setSiccess} />}
        </>
    )
}
