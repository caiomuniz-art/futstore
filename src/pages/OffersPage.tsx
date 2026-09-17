import { ProductCard } from '../components/product/ProductCard'
import { products } from '../data/products'

export function OffersPage() {
  const offers = products.filter((item) => item.onSale)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pitch-light">Promoções</p>
      <h1 className="text-4xl font-extrabold text-pitch">Ofertas da semana</h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Descontos reais em modelos selecionados. Estoque limitado — o gol é agora.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
