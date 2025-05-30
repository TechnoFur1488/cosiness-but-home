import { Container } from "@/components/shared"
import { Products } from "@/components/shared/products"

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/products?offset=0`, {
    next: {
      revalidate: 3600
    }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }

  console.log(`[${new Date().toISOString()}] Fetching products`)

  return res.json()
}

export default async function ShopPage() {
  const initialData = await getProducts()

  return (
    <Container className={"my-20"}>
      <Products initialData={initialData} />
    </Container>
  )
}
