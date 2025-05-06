"use client"

import React from 'react'
import { Input } from '../ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface Props {
    className?: string
}

export const AdminLoginForm: React.FC<Props> = ({ className }) => {

    const formSchema = z.object({
        name: z.string(),
        email: z.string(),
        password: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    // const onSubmit 

    return (
        <div className={className}>
            <Input type='text' />
            <Input type='password' />

        </div>
    )
}