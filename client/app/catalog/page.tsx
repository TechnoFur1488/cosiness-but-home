import { Catalog, Container } from "@/components/shared";

export default function CatalogPage() {
    return (
        <Container className={"my-20 sm:max-w-250"}>
            <h1 className={"font-bold text-[32px] mb-7"}>Каталог</h1>
            <Catalog />
        </Container>
    )
}