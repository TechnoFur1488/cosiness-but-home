"use client"

import { useRegistrationMutation } from '@/store/apiSlice'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
    className?: string
}

export const Register: React.FC<Props> = ({ className }) => {
    const router = useRouter()
    const [register] = useRegistrationMutation()
    const [status, setStatus] = useState(false)
    const [checkedPassword, setCheckedPassword] = useState(false)

    const formSchema = z.object({
        name: z.string().min(2, { message: "Имя не может быть короче 2 символов" }),
        email: z.string().email({ message: "Введите корректный email" }),
        password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await register({
                name: data.name,
                email: data.email,
                password: data.password
            }).unwrap()
            localStorage.setItem("token", response.token)
            router.push("/")
        } catch (err) {
            setStatus(true)
            console.error(err)
        }
    }

    return (
        <div className={className}>
            <Form {...form}>
                <form className={'bg-[#F8F8F8] rounded-2xl w-120 p-10 border-1 border-[#e3e3ec]'} onSubmit={form.handleSubmit(onSubmit)}>
                    <h1 className={"pb-10 font-medium text-2xl"}>Создайте аккаунт</h1>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={"text-[16px]"}>Ваше имя</FormLabel>
                                <FormControl>
                                    <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className={'py-5'}>
                                <FormLabel className={"text-[16px]"}>Ваш Email</FormLabel>
                                <FormControl>
                                    <Input type='email' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem className={"mb-9"}>
                                <FormLabel className={"text-[16px]"}>Ваш пароль</FormLabel>
                                <FormControl>
                                    <div className={"relative"}>
                                        <Input type={checkedPassword ? "text" : "password"}  {...field} />
                                        <button type={"button"} onClick={() => setCheckedPassword(!checkedPassword)} className={"cursor-pointer absolute right-2 top-1 bottom-1"}>{checkedPassword ? <Eye /> : <EyeOff /> }</button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {status && <span className={"mb-3 text-red-500 font-medium"}>Ошибка регистрации</span>}
                    <Button className={"bg-[#E5E5EA] text-black cursor-pointer hover:bg-[#DBDBDB] w-full transition duration-150 mt-3"} type='submit'>Зарегистрироваться</Button>
                </form>
            </Form>
        </div>
    )
}