import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getProduct } from '../data/products'
import { readStorage, writeStorage } from '../lib/utils'
import type { CartItem } from '../types'

const KEY = 'futstore_cart'

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (productId: string, size: number, quantity?: number) => void
  setQuantity: (productId: string, size: number, quantity: number) => void
  removeItem: (productId: string, size: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage(KEY, []))

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    writeStorage(KEY, next)
  }, [])

  const addItem = useCallback(
    (productId: string, size: number, quantity = 1) => {
      persist(
        (() => {
          const current = readStorage<CartItem[]>(KEY, [])
          const index = current.findIndex(
            (item) => item.productId === productId && item.size === size,
          )
          if (index >= 0) {
            const copy = [...current]
            copy[index] = {
              ...copy[index],
              quantity: copy[index].quantity + quantity,
            }
            return copy
          }
          return [...current, { productId, size, quantity }]
        })(),
      )
    },
    [persist],
  )

  const setQuantity = useCallback(
    (productId: string, size: number, quantity: number) => {
      if (quantity <= 0) {
        persist(
          readStorage<CartItem[]>(KEY, []).filter(
            (item) => !(item.productId === productId && item.size === size),
          ),
        )
        return
      }
      persist(
        readStorage<CartItem[]>(KEY, []).map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item,
        ),
      )
    },
    [persist],
  )

  const removeItem = useCallback(
    (productId: string, size: number) => {
      persist(
        readStorage<CartItem[]>(KEY, []).filter(
          (item) => !(item.productId === productId && item.size === size),
        ),
      )
    },
    [persist],
  )

  const clear = useCallback(() => persist([]), [persist])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const product = getProduct(item.productId)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, count, subtotal, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de CartProvider')
  return ctx
}
