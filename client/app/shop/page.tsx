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
    <Container className={"sm:my-20 my-5"}>
      <div className={"mb-3 sm:mb-5 md:mb-7"}>
        <h1 className={"text-2xl sm:text-3xl md:text-[32px] font-bold pb-2 sm:pb-3 md:pb-4"}>Весь ассортимент</h1>
        <span className={"text-[#737373] text-sm sm:text-base md:text-lg block max-w-3xl"}>
          Познакомьтесь с нашей тщательно отобранной коллекцией ковров премиум-класса, призванных придать вашему жилому дому пространству комфорт и стиль
        </span>
      </div>
      <Products initialData={initialData} />
    </Container>
  )
}