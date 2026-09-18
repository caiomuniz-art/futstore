import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="grid min-h-[40vh] place-items-center px-4 py-16 text-sm text-neutral-500">
        Verificando sessão...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />
  }

  return children
}
