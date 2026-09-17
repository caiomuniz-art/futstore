import { Link } from 'react-router-dom'
import { discountOf } from '../../data/products'
import { formatBRL } from '../../lib/utils'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../../context/ToastContext'
import { Badge } from '../ui/Badge'
import { Rating } from '../ui/Rating'

export function ProductCard({ product }: { product: Product }) {
  const discount = discountOf(product)
  const { addItem } = useCart()
  const { has, toggle } = useFavorites()
  const { notify } = useToast()
  const liked = has(product.id)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-pitch/8 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {discount > 0 ? <Badge tone="red">-{discount}%</Badge> : null}
          {product.bestseller ? <Badge>Mais vendida</Badge> : null}
        </div>
        <button
          type="button"
          aria-label={liked ? 'Remover dos favoritos' : 'Favoritar'}
          onClick={() => {
            toggle(product.id)
            notify(liked ? 'Removido dos favoritos' : 'Salvo nos favoritos')
          }}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-lg shadow ${
            liked ? 'bg-pitch text-lime' : 'bg-white/90 text-pitch'
          }`}
        >
          {liked ? '♥' : '♡'}
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pitch-light">
          {product.brand} · {product.fieldType}
        </p>
        <h3 className="text-lg font-semibold leading-tight text-pitch">{product.name}</h3>
        <Rating value={product.rating} reviews={product.reviews} />
        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            {discount > 0 ? (
              <p className="text-sm text-neutral-400 line-through">
                {formatBRL(product.originalPrice)}
              </p>
            ) : null}
            <p className="text-xl font-extrabold text-pitch">{formatBRL(product.price)}</p>
          </div>
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-pitch">
            {product.color}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/produto/${product.id}`}
            className="rounded-full bg-pitch px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-pitch-light"
          >
            Ver produto
          </Link>
          <button
            type="button"
            className="rounded-full bg-lime px-3 py-2.5 text-sm font-semibold text-pitch hover:bg-lime-dark hover:text-white"
            onClick={() => {
              addItem(product.id, product.sizes[2] ?? product.sizes[0])
              notify('Adicionado ao carrinho')
            }}
          >
            Comprar
          </button>
        </div>
      </div>
    </article>
  )
}
