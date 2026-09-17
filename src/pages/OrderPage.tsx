import { Link, useParams } from 'react-router-dom'
import { ButtonLink } from '../components/ui/Button'
import { formatBRL, readStorage } from '../lib/utils'
import type { Order } from '../types'

export function OrderPage() {
  const { id } = useParams()
  const order = readStorage<Order | null>('futstore_last_order', null)

  if (!order || order.id !== id) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-pitch">Pedido não encontrado</h1>
        <Link to="/" className="mt-4 inline-block font-semibold underline">
          Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pitch-light">
        Pedido confirmado
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-pitch">Valeu, {order.customerName}!</h1>
      <p className="mt-4 text-neutral-600">
        Número do pedido <strong>{order.id}</strong>. Total {formatBRL(order.total)}. Esta é uma
        simulação — nenhum pagamento real foi processado.
      </p>
      <div className="mt-8">
        <ButtonLink to="/chuteiras">Continuar comprando</ButtonLink>
      </div>
    </div>
  )
}
