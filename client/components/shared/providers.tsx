"use client"

import { store } from '@/store/store'
import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Header } from './header'
import { Footer } from './footer'

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Provider store={store}>
            <Header />
            {children}
            <Footer />
        </Provider>
    )
}