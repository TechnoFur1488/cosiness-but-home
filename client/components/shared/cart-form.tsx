import { usePostOrderMutation } from '@/store/apiSlice'
import React from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { IMaskInput } from 'react-imask'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import Link from 'next/link'
import { Button } from '../ui/button'

interface Props {
    isTotal: Array<number>
}

export const CartForm = ({ isTotal }: Props) => {
    const [postOrder] = usePostOrderMutation()

    const formSchema = z.object({
        mail: z.string().email({ message: "Некорректная почта" }),
        name: z.string().min(2, { message: "Имя слишком короткое" }),
        adress: z.string().min(3, { message: "Адресс слишком короткий" }),
        phone: z.string().min(18, { message: "Некорректный номер телефона" }),
        delivery: z.enum(["Курьером (по Москве)", "Самовывоз"]),
        pay: z.enum(["Наличными", "Переводос"]),
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
            policy: false
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await postOrder({
                newOrder: data
            })
        } catch (err) {
            console.error(err)
        }
    }

    const isFormValid = form.formState.isValid;

    const total: number = isTotal.reduce((sum, num) => sum + num, 0)

    return (
        <div>
            <span className='text-3xl font-medium text-black'>
                Итого: {total.toLocaleString("ru-RU", {style: "currency", currency: "RUB", minimumFractionDigits: 0, maximumFractionDigits: 0})}
            </span>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className={"bg-[#F8F8F8] w-116 px-8 py-4 rounded-2xl mt-2"}>
                        <h1 className='mb-9 text-center text-[20px] font-medium text-[#6E6E73]'>Данные для потверждения покупки</h1>
                        <FormField
                            control={form.control}
                            name='mail'
                            render={({ field }) => (
                                <FormItem className={"mb-2.5"}>
                                    <FormLabel>Ваш Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' {...field} />
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
                            name='name'
                            render={({ field }) => (
                                <FormItem className={"mb-2.5"}>
                                    <FormLabel>Ваше имя</FormLabel>
                                    <FormControl>
                                        <Input type='text' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='adress'
                            render={({ field }) => (
                                <FormItem className={"mb-2.5"}>
                                    <FormLabel>Ваш адресс</FormLabel>
                                    <FormControl>
                                        <Input type='text' {...field} />
                                    </FormControl>
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
                    </div>
                    <div className={"bg-[#F8F8F8] w-116 px-8 py-4 rounded-2xl my-3"}>
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
                    </div>
                    <div className={"bg-[#F8F8F8] w-116 px-8 py-4 rounded-2xl"}>
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
                    </div>
                    <FormField
                        control={form.control}
                        name="policy"
                        render={({ field }) => (
                            <FormItem className={'flex flex-col my-3'}>
                                <div className={'flex'}>
                                    <FormControl className='cursor-pointer'>
                                        <Checkbox defaultChecked={false} checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className='pl-3 flex items-center'>Соглашаюсь на обработку своих<Link className=' text-gray-600 underline' href={"/personal"}>персональных данных</Link></FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={!isFormValid} className={"bg-[#E5E5EA] w-full  text-black cursor-pointer hover:bg-[#DBDBDB] transition duration-150"} type="submit">Оформить</Button>
                </form>
            </Form>
        </div>
    )
}
