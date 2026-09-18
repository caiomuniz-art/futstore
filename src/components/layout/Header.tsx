import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { products } from '../../data/products'
import { formatBRL } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'

const nav = [
  { to: '/', label: 'Início' },
  { to: '/chuteiras', label: 'Chuteiras' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/sobre', label: 'Sobre nós' },
]

export function Header() {
  const { count } = useCart()
  const { ids } = useFavorites()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    const q = query.trim()
    setSearchOpen(false)
    setOpen(false)
    navigate(q ? `/chuteiras?q=${encodeURIComponent(q)}` : '/chuteiras')
  }

  const results = query.trim()
    ? products
        .filter((item) =>
          `${item.name} ${item.brand} ${item.fieldType}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : []

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-pitch/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-lg text-pitch">
            ⚽
          </span>
          <span className="text-xl">
            Fut<span className="text-lime">Store</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'text-lime' : 'text-white/80 hover:text-lime'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Pesquisar"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          >
            <SearchIcon />
          </button>
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          >
            <span className="text-lg">♡</span>
            {ids.length > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-pitch">
                {ids.length}
              </span>
            ) : null}
          </Link>
          <Link
            to="/carrinho"
            aria-label="Carrinho"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
          >
            <CartIcon />
            {count > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-pitch">
                {count}
              </span>
            ) : null}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="max-w-28 truncate text-sm text-white/80">{user.name}</span>
              <button
                type="button"
                onClick={() => {
                void logout()
              }}
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/entrar"
              className="hidden rounded-full bg-lime px-4 py-2 text-sm font-semibold text-pitch hover:bg-white sm:inline-flex"
            >
              Entrar
            </Link>
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open ? (
        <div className="space-y-2 border-t border-white/10 px-4 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              className="block w-full rounded-xl px-3 py-2 text-left hover:bg-white/10"
              onClick={() => {
                void logout()
                setOpen(false)
              }}
            >
              Sair da conta
            </button>
          ) : (
            <Link
              to="/entrar"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-lime px-3 py-2 text-center font-semibold text-pitch"
            >
              Entrar
            </Link>
          )}
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 p-4" onClick={() => setSearchOpen(false)}>
          <form
            onSubmit={submitSearch}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto mt-24 max-w-xl rounded-3xl bg-white p-4 text-pitch shadow-2xl"
          >
            <div className="flex gap-2">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar chuteiras, marcas ou tipo de campo"
                className="flex-1 rounded-full border border-pitch/15 px-4 py-3 outline-none focus:border-pitch"
              />
              <button
                type="submit"
                className="rounded-full bg-pitch px-5 font-semibold text-white"
              >
                Buscar
              </button>
            </div>
            {results.length > 0 ? (
              <ul className="mt-3 divide-y divide-pitch/8">
                {results.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/produto/${item.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between gap-3 px-2 py-3 hover:bg-mist"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-neutral-500">{formatBRL(item.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </form>
        </div>
      ) : null}
    </header>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
    </svg>
  )
}
