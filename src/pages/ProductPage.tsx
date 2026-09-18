import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Badge } from '../components/ui/Badge'
import { Rating } from '../components/ui/Rating'
import { discountOf, getProduct, products } from '../data/products'
import { formatBRL } from '../lib/utils'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'

export function ProductPage() {
  const { id } = useParams()
  const product = id ? getProduct(id) : undefined
  const { addItem } = useCart()
  const { has, toggle } = useFavorites()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [size, setSize] = useState<number | null>(null)
  const [photo, setPhoto] = useState('')

  useEffect(() => {
    if (!product) return
    setSize(product.sizes[2] ?? product.sizes[0])
    setPhoto(product.image)
  }, [product])

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-pitch">Produto não encontrado</h1>
        <Link to="/chuteiras" className="mt-4 inline-block font-semibold text-pitch underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const discount = discountOf(product)
  const related = products.filter(
    (item) => item.id !== product.id && item.fieldType === product.fieldType,
  ).slice(0, 4)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-neutral-500">
        <Link to="/">Início</Link> / <Link to="/chuteiras">Chuteiras</Link> / {product.name}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <img
            src={photo || product.image}
            alt={product.name}
            className="aspect-square w-full rounded-3xl object-cover"
          />
          <div className="mt-3 grid grid-cols-3 gap-3">
            {product.gallery.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setPhoto(src)}
                className={`overflow-hidden rounded-2xl border-2 ${
                  (photo || product.image) === src ? 'border-pitch' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pitch-light">
            {product.brand} · {product.fieldType}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-pitch">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rating value={product.rating} reviews={product.reviews} />
            {discount > 0 ? <Badge tone="red">-{discount}%</Badge> : null}
          </div>
          <div className="mt-6">
            {discount > 0 ? (
              <p className="text-neutral-400 line-through">{formatBRL(product.originalPrice)}</p>
            ) : null}
            <p className="text-4xl font-extrabold text-pitch">{formatBRL(product.price)}</p>
            <p className="mt-1 text-sm text-neutral-500">em até 10x sem juros no cartão</p>
          </div>
          <p className="mt-6 leading-relaxed text-neutral-700">{product.description}</p>
          <p className="mt-4 text-sm text-neutral-500">Cor: {product.color}</p>

          <div className="mt-6">
            <p className="font-semibold text-pitch">Tamanho</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSize(value)}
                  className={`h-11 w-11 rounded-full border text-sm font-semibold ${
                    size === value
                      ? 'border-pitch bg-pitch text-white'
                      : 'border-pitch/20 bg-white hover:border-pitch'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-lime px-6 py-3 font-semibold text-pitch hover:bg-lime-dark hover:text-white"
              onClick={() => {
                if (!size) {
                  notify('Escolha um tamanho')
                  return
                }
                addItem(product.id, size)
                notify('Adicionado ao carrinho')
              }}
            >
              Adicionar ao carrinho
            </button>
            <button
              type="button"
              className="rounded-full bg-pitch px-6 py-3 font-semibold text-white hover:bg-pitch-light"
              onClick={() => {
                if (!size) {
                  notify('Escolha um tamanho')
                  return
                }
                addItem(product.id, size)
                navigate('/carrinho')
              }}
            >
              Comprar agora
            </button>
            <button
              type="button"
              className="rounded-full border border-pitch/20 px-6 py-3 font-semibold text-pitch"
              onClick={() => {
                const liked = has(product.id)
                toggle(product.id)
                notify(liked ? 'Removido dos favoritos' : 'Salvo nos favoritos')
              }}
            >
              {has(product.id) ? 'Favoritado' : 'Favoritar'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-pitch">Você também pode gostar</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
