import React, { PropsWithChildren } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription } from '../ui/alert-dialog'

export const ModalInformation = ({ children }: PropsWithChildren) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger className={"cursor-pointer font-medium"}>ЕЩЕ</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Описание</AlertDialogTitle>
                    <AlertDialogDescription>
                        {children}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"cursor-pointer"}>Закрыть</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}