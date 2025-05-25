"use client"

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/store/apiSlice'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'


export const Login = () => {
    const router = useRouter()
    const [login] = useLoginMutation()
    const [status, setStatus] = useState(false)
    const [checkPassword, setCheckPassword] = useState(false)

    const formSchema = z.object({
        email: z.string().email({ message: "Введите корректный email" }),
        password: z.string().min(8, { message: "Пароль должен содержать не менее 8 символов" })
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await login({
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
        <div>
            <Form {...form}>
                <form className={'bg-[#F8F8F8] rounded-2xl w-120 p-10 border-1 border-[#e3e3ec]'} onSubmit={form.handleSubmit(onSubmit)}>
                    <h1 className={"pb-10 font-medium text-2xl"}>Войдите в аккаунт</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
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
                            <FormItem className={'mt-5 mb-9'}>
                                <FormLabel className={"text-[16px]"}>Ваш пароль</FormLabel>
                                <FormControl>
                                    <div className={"relative"}>
                                        <Input type={checkPassword ? 'true' : "password"} {...field} />
                                        <button type={"button"} onClick={() => setCheckPassword(!checkPassword)} className={"cursor-pointer absolute right-2 top-1 bottom-1"}>{checkPassword ? <Eye /> : <EyeOff />}</button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {status && <span className={"mb-3 text-red-500 font-medium"}>Неверный пароль или почта</span>}
                    <Button className={"bg-[#E5E5EA] text-black cursor-pointer hover:bg-[#DBDBDB] w-full transition duration-150 mt-3"} type='submit'>Войти</Button>
                </form>
            </Form>
        </div>
    )
}