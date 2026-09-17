import { Link } from 'react-router-dom'
import { getProduct } from '../data/products'
import { formatBRL } from '../lib/utils'
import { useCart } from '../context/CartContext'
import { ButtonLink } from '../components/ui/Button'

export function CartPage() {
  const { items, subtotal, setQuantity, removeItem } = useCart()
  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 29.9
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-pitch">Seu carrinho está vazio</h1>
        <p className="mt-3 text-neutral-600">Escolha a chuteira e entra em campo.</p>
        <div className="mt-6">
          <ButtonLink to="/chuteiras">Ver chuteiras</ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-pitch">Carrinho</h1>
        {items.map((item) => {
          const product = getProduct(item.productId)
          if (!product) return null
          return (
            <article
              key={`${item.productId}-${item.size}`}
              className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm sm:flex-row"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-28 w-full rounded-2xl object-cover sm:w-36"
              />
              <div className="flex flex-1 flex-col">
                <Link to={`/produto/${product.id}`} className="font-semibold text-pitch">
                  {product.name}
                </Link>
                <p className="text-sm text-neutral-500">
                  {product.brand} · Tam. {item.size}
                </p>
                <p className="mt-auto font-bold">{formatBRL(product.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border"
                  onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border"
                  onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => removeItem(item.productId, item.size)}
                >
                  Remover
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-pitch">Resumo</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span>Frete</span>
            <span>{shipping === 0 ? 'Grátis' : formatBRL(shipping)}</span>
          </p>
          <p className="flex justify-between border-t pt-3 text-lg font-extrabold">
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </p>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Frete grátis acima de R$ 499.</p>
        <ButtonLink to="/checkout" className="mt-5 w-full">
          Finalizar compra
        </ButtonLink>
      </aside>
    </div>
  )
}
