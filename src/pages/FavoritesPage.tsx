import { ProductCard } from '../components/product/ProductCard'
import { ButtonLink } from '../components/ui/Button'
import { products } from '../data/products'
import { useFavorites } from '../context/FavoritesContext'

export function FavoritesPage() {
  const { ids } = useFavorites()
  const list = products.filter((item) => ids.includes(item.id))

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-pitch">Nenhum favorito ainda</h1>
        <p className="mt-3 text-neutral-600">Toque no coração nos cards para guardar chuteiras.</p>
        <div className="mt-6">
          <ButtonLink to="/chuteiras">Explorar catálogo</ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-pitch">Favoritos</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
