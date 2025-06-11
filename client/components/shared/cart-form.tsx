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
    refetch: () => void
}

export const CartForm = ({ refetch }: Props) => {
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
            }).unwrap()
            await refetch()
        } catch (err) {
            console.error(err)
        }
    }

    const isFormValid = form.formState.isValid;

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="bg-white rounded-2xl shadow p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl font-bold mb-6">Данные для подтверждения покупки</h1>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name='mail'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' {...field} className="w-full" />
                                        </FormControl>
                                        <FormDescription className="text-xs text-gray-500">
                                            На эту почту придет информация о покупке (проверьте спам)
                                        </FormDescription>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Имя</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='adress'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Адрес</FormLabel>
                                        <FormControl>
                                            <Input type='text' {...field} className="w-full" />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">Номер телефона</FormLabel>
                                        <FormControl>
                                            <IMaskInput
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-md border border-gray-200",
                                                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                                                    "placeholder:text-gray-400 text-sm"
                                                )}
                                                mask="+7 (000) 000-00-00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow p-4 md:p-6">
                        <FormField
                            control={form.control}
                            name="delivery"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium block mb-3">Способ доставки</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="Курьером (по Москве)" />
                                                </FormControl>
                                                <FormLabel className="text-sm">Курьером (по Москве)</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="Самовывоз" />
                                                </FormControl>
                                                <FormLabel className="text-sm">Самовывоз</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow p-4 md:p-6">
                        <FormField
                            control={form.control}
                            name="pay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium block mb-3">Способ оплаты</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="Наличными" />
                                                </FormControl>
                                                <FormLabel className="text-sm">Наличными</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="Переводом" />
                                                </FormControl>
                                                <FormLabel className="text-sm">Переводом</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="policy"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-start space-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <FormLabel className="text-sm">
                                        <span>
                                            Соглашаюсь на обработку своих 
                                            <Link className="text-blue-600 hover:underline pl-1" href="/personal">
                                                 персональных данных
                                            </Link>
                                        </span>
                                    </FormLabel>
                                </div>
                                <FormMessage className="text-xs text-red-500 mt-1" />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={!isFormValid}
                        className={cn(
                            "w-full py-3 text-white font-medium rounded-xl",
                            "bg-black hover:bg-[#222222] transition-colors duration-200",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                        type="submit"
                    >
                        Оформить заказ
                    </Button>
                </form>
            </Form>
        </div>
    )
}
