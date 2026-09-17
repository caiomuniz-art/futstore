import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { formatBRL } from '../lib/utils'
import { writeStorage } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [payment, setPayment] = useState('pix')

  const shipping = subtotal >= 499 ? 0 : 29.9
  const total = subtotal + shipping

  if (items.length === 0) return <Navigate to="/carrinho" replace />

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const orderId = `FS-${Date.now().toString().slice(-8)}`
    writeStorage('futstore_last_order', {
      id: orderId,
      createdAt: new Date().toISOString(),
      total,
      items,
      customerName: name,
    })
    clear()
    navigate(`/pedido/${orderId}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-pitch">Checkout</h1>
      <p className="mt-2 text-neutral-600">
        Pedido simulado: os dados ficam só neste navegador. Total {formatBRL(total)}.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">
          Nome completo
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-pitch/15 px-4 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Endereço
          <input
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-pitch/15 px-4 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Cidade / UF
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-pitch/15 px-4 py-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Pagamento
          <select
            value={payment}
            onChange={(event) => setPayment(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-pitch/15 px-4 py-3"
          >
            <option value="pix">Pix (aprovação imediata)</option>
            <option value="card">Cartão em até 10x</option>
            <option value="boleto">Boleto</option>
          </select>
        </label>
        <button type="submit" className="w-full rounded-full bg-lime py-3 font-semibold text-pitch">
          Confirmar pedido · {formatBRL(total)}
        </button>
      </form>
    </div>
  )
}
