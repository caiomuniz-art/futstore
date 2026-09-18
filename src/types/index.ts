export type FieldType = 'Campo' | 'Society' | 'Futsal'

export type Product = {
  id: string
  name: string
  brand: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  fieldType: FieldType
  popularity: number
  featured: boolean
  bestseller: boolean
  onSale: boolean
  description: string
  image: string
  gallery: string[]
  sizes: number[]
  color: string
}

export type CartItem = {
  productId: string
  size: number
  quantity: number
}

export type SessionUser = {
  id?: string
  name: string
  email: string
}

export type Order = {
  id: string
  createdAt: string
  total: number
  items: CartItem[]
  customerName: string
}
