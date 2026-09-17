import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { brands, fieldTypes, products } from '../data/products'
import type { FieldType } from '../types'

type SortKey = 'popularidade' | 'preco-asc' | 'preco-desc'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [search, setSearch] = useState(q)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<FieldType[]>([])
  const [maxPrice, setMaxPrice] = useState(1600)
  const sort = (params.get('ordenar') as SortKey) || 'popularidade'

  const filtered = useMemo(() => {
    const query = (params.get('q') ?? search).trim().toLowerCase()
    const list = products.filter((item) => {
      const matchesQuery =
        !query ||
        `${item.name} ${item.brand} ${item.fieldType}`.toLowerCase().includes(query)
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(item.brand)
      const matchesField =
        selectedFields.length === 0 || selectedFields.includes(item.fieldType)
      const matchesPrice = item.price <= maxPrice
      return matchesQuery && matchesBrand && matchesField && matchesPrice
    })

    return [...list].sort((a, b) => {
      if (sort === 'preco-asc') return a.price - b.price
      if (sort === 'preco-desc') return b.price - a.price
      return b.popularity - a.popularity
    })
  }, [params, search, selectedBrands, selectedFields, maxPrice, sort])

  function toggleValue<T>(list: T[], value: T, setter: (next: T[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  function applySearch(event: FormEvent) {
    event.preventDefault()
    const next = new URLSearchParams(params)
    if (search.trim()) next.set('q', search.trim())
    else next.delete('q')
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pitch-light">
          Catálogo
        </p>
        <h1 className="text-4xl font-extrabold text-pitch">Todas as chuteiras</h1>
        <p className="mt-2 text-neutral-600">
          Filtre por marca, preço e tipo de campo. {filtered.length} modelo
          {filtered.length === 1 ? '' : 's'} encontrado{filtered.length === 1 ? '' : 's'}.
        </p>
      </div>

      <form onSubmit={applySearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Pesquisar por nome, marca ou campo"
          className="flex-1 rounded-full border border-pitch/15 bg-white px-5 py-3 outline-none focus:border-pitch"
        />
        <button
          type="submit"
          className="rounded-full bg-pitch px-6 py-3 font-semibold text-white hover:bg-pitch-light"
        >
          Pesquisar
        </button>
      </form>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit space-y-6 rounded-3xl bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-pitch">Marca</h2>
            <div className="mt-3 space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleValue(selectedBrands, brand, setSelectedBrands)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-pitch">Preço até {maxPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</h2>
            <input
              type="range"
              min={200}
              max={1600}
              step={50}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-3 w-full accent-pitch"
            />
          </div>
          <div>
            <h2 className="font-semibold text-pitch">Tipo de campo</h2>
            <div className="mt-3 space-y-2">
              {fieldTypes.map((field) => (
                <label key={field} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => toggleValue(selectedFields, field, setSelectedFields)}
                  />
                  {field}
                </label>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-pitch underline"
            onClick={() => {
              setSelectedBrands([])
              setSelectedFields([])
              setMaxPrice(1600)
              setSearch('')
              setParams({})
            }}
          >
            Limpar filtros
          </button>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">Ordenar</p>
            <select
              value={sort}
              onChange={(event) => {
                const next = new URLSearchParams(params)
                next.set('ordenar', event.target.value)
                setParams(next)
              }}
              className="rounded-full border border-pitch/15 bg-white px-4 py-2 text-sm"
            >
              <option value="popularidade">Mais populares</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p className="text-lg font-semibold text-pitch">Nenhuma chuteira encontrada</p>
              <p className="mt-2 text-neutral-500">Tente outro termo ou limpe os filtros.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
