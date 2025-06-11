"use client"

import NotFound from '@/app/not-found'
import { CreateProduct } from './create-product'
import { LastOrder } from './last-order'
import { useTokenDecryptor } from '../hooks/use-token-decryptor'
import { RatingAll } from './rating-all'
import { CatalogCreate } from './catalog-create'


export const AdminPanel = () => {
    const role = useTokenDecryptor()

    return (
        <div>
            {role === "ADMIN"
                ?
                <div>
                    <div className={"flex justify-between"}>
                        <CreateProduct />
                        <LastOrder />
                    </div>
                    <RatingAll />
                    <CatalogCreate />
                    
                </div>
                : <NotFound />
            }
        </div>
    )
}