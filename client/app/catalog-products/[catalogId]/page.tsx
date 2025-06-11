import { CatalogName, Container, ProductCatalog } from '@/components/shared'

const dynamicParams = true

async function getProductsCatalog(catalogId: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/catalog/${catalogId}?offset=0`, {
        next: {
            revalidate: 3600
        }
    })

    if (!res.ok) {
        throw new Error('Failed to fetch products')
    }

    return res.json()
}

export default async function CatalogProduct({ params }: { params: { catalogId: string } }) {
    const resolvedParams = await Promise.resolve(params)
    const catalogId = Number(resolvedParams.catalogId)


    const initialData = await getProductsCatalog(catalogId)

    return (
        <Container className='my-20'>
            <CatalogName catalogId={catalogId} />
            <ProductCatalog catalogId={catalogId} initialData={initialData} />
        </Container>
    )
}