"use client"

import { store } from '@/store/store'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Header } from './header'
import { Footer } from './footer'

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </Provider>
    )
}