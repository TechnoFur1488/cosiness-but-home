"use client"

import { store } from '@/store/store'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { Header } from './header'
import { SearchInput } from './search-input'

export const Providers = ({ children }: PropsWithChildren) => {
    return (
        <Provider store={store}>
            <div className="min-h-screen flex flex-col">
                <Header className={"lg:block hidden"} />
                <div className={"lg:hidden block sticky top-0 bg-white z-50 rounded-b-2xl sm:px-6"}>
                    <SearchInput className={"sm:max-w-[892px] max-w-[358px] m-auto w-full my-2"} />
                </div>
                <main className="flex-1">
                    {children}
                </main>
                <Header className={"block lg:hidden "} />
            </div>
        </Provider>
    )
}