"use client"

import { store } from '@/store/store'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Header } from './header'
import { Footer } from './footer'

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <Header />
            {children}
            <Footer />
        </Provider>
    )
}