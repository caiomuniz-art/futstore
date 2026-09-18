import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/auth/AuthCard'
import { AuthField } from '../components/auth/AuthField'
import { useAuth } from '../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!emailPattern.test(email.trim())) next.email = 'Informe um e-mail válido.'
    if (!password) next.password = 'A senha é obrigatória.'
    else if (password.length < 8) next.password = 'A senha deve ter pelo menos 8 caracteres.'
    if (confirmPassword !== password) {
      next.confirmPassword = 'A confirmação de senha deve ser exatamente igual à senha.'
    }
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length > 0) return

    setPending(true)
    const error = await register(email, password, confirmPassword)
    setPending(false)
    if (error) {
      setFormError(error)
      return
    }
    navigate('/entrar', { replace: true, state: { registered: true } })
  }

  return (
    <AuthCard
      kicker="Nova conta"
      title="Criar conta"
      subtitle="Cadastre um e-mail e uma senha para comprar com login protegido."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField
          label="E-mail"
          type="email"
          value={email}
          autoComplete="email"
          error={errors.email}
          onChange={(value) => {
            setEmail(value)
            setErrors((current) => ({ ...current, email: '' }))
            setFormError('')
          }}
        />
        <AuthField
          label="Senha"
          type="password"
          value={password}
          autoComplete="new-password"
          error={errors.password}
          onChange={(value) => {
            setPassword(value)
            setErrors((current) => ({ ...current, password: '' }))
            setFormError('')
          }}
        />
        <AuthField
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          autoComplete="new-password"
          error={errors.confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value)
            setErrors((current) => ({ ...current, confirmPassword: '' }))
            setFormError('')
          }}
        />
        {formError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-lime py-3 font-semibold text-pitch transition hover:bg-lime-dark hover:text-white disabled:opacity-60"
        >
          {pending ? 'Criando conta...' : 'Criar conta'}
        </button>
        <Link
          to="/entrar"
          className="block text-center text-sm font-semibold text-pitch underline decoration-pitch/30 underline-offset-4 hover:decoration-pitch"
        >
          Já tenho uma conta? Entrar
        </Link>
      </form>
    </AuthCard>
  )
}
