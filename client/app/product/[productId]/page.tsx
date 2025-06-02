import { Container, ProductOption, Rating } from '@/components/shared'
import React from 'react'



export default function ProductPage() {

    return (
        <Container className='my-20 max-w-250'>
            <ProductOption />
            <Rating />
        </Container>
    )
}