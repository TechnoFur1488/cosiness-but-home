"use client"

import { Container } from "@/components/shared"
import { SearchProducts } from "@/components/shared/search-products"

export default function SearchPage() {
    return (
        <Container className={"my-20"}>
            <SearchProducts />
        </Container>
    )
}