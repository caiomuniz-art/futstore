import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readStorage, writeStorage } from '../lib/utils'

const KEY = 'futstore_favorites'

type FavoritesContextValue = {
  ids: string[]
  toggle: (productId: string) => void
  has: (productId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readStorage(KEY, []))

  const persist = useCallback((next: string[]) => {
    setIds(next)
    writeStorage(KEY, next)
  }, [])

  const toggle = useCallback(
    (productId: string) => {
      const current = readStorage<string[]>(KEY, [])
      persist(
        current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId],
      )
    },
    [persist],
  )

  const has = useCallback(
    (productId: string) => ids.includes(productId),
    [ids],
  )

  const value = useMemo(() => ({ ids, toggle, has }), [ids, toggle, has])

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites precisa estar dentro de FavoritesProvider')
  return ctx
}
