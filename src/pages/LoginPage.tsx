import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthCard } from '../components/auth/AuthCard'
import { AuthField } from '../components/auth/AuthField'
import { useAuth } from '../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [pending, setPending] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string; registered?: boolean } | null)?.from ?? '/'
  const registered = Boolean((location.state as { registered?: boolean } | null)?.registered)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextEmailError = emailPattern.test(email.trim()) ? '' : 'Informe um e-mail válido.'
    const nextPasswordError = password ? '' : 'A senha é obrigatória.'
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setFormError('')
    if (nextEmailError || nextPasswordError) return

    setPending(true)
    const error = await login(email, password)
    setPending(false)
    if (error) {
      setFormError(error)
      return
    }
    navigate(from === '/cadastro' || from === '/entrar' ? '/' : from, { replace: true })
  }

  if (user) {
    return (
      <AuthCard
        kicker="Sessão ativa"
        title={`Olá, ${user.name}`}
        subtitle={`Você já está conectado como ${user.email}.`}
      >
        <button
          type="button"
          className="w-full rounded-full bg-lime py-3 font-semibold text-pitch transition hover:bg-lime-dark hover:text-white"
          onClick={() => navigate('/')}
        >
          Ir para a página inicial
        </button>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      kicker="Acesso"
      title="Entrar"
      subtitle="Use o e-mail e a senha da sua conta FutStore."
    >
      {registered ? (
        <p className="mb-4 rounded-2xl bg-lime/40 px-4 py-3 text-sm font-medium text-pitch">
          Conta criada com sucesso. Entre para continuar.
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <AuthField
          label="E-mail"
          type="email"
          value={email}
          autoComplete="email"
          error={emailError}
          onChange={(value) => {
            setEmail(value)
            setEmailError('')
            setFormError('')
          }}
        />
        <AuthField
          label="Senha"
          type="password"
          value={password}
          autoComplete="current-password"
          error={passwordError}
          onChange={(value) => {
            setPassword(value)
            setPasswordError('')
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
          {pending ? 'Entrando...' : 'Entrar'}
        </button>
        <Link
          to="/cadastro"
          className="block text-center text-sm font-semibold text-pitch underline decoration-pitch/30 underline-offset-4 hover:decoration-pitch"
        >
          Ainda não tenho uma conta? Criar conta
        </Link>
      </form>
    </AuthCard>
  )
}
