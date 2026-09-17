import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { user, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const redirect = (location.state as { from?: string } | null)?.from ?? '/'

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result =
      mode === 'login' ? login(email, password) : register(name, email, password)
    if (result) {
      setError(result)
      return
    }
    navigate(redirect)
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-pitch">Olá, {user.name}</h1>
        <p className="mt-2 text-neutral-600">Você já está conectado como {user.email}.</p>
        <button
          type="button"
          className="mt-6 rounded-full bg-pitch px-5 py-2.5 font-semibold text-white"
          onClick={() => navigate('/chuteiras')}
        >
          Continuar comprando
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold text-pitch">
        {mode === 'login' ? 'Entrar' : 'Criar conta'}
      </h1>
      <p className="mt-2 text-neutral-600">
        A sessão fica salva neste navegador enquanto não houver backend.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-3xl bg-white p-6 shadow-sm">
        {mode === 'register' ? (
          <Field label="Nome" value={name} onChange={setName} />
        ) : null}
        <Field label="E-mail" type="email" value={email} onChange={setEmail} />
        <Field label="Senha" type="password" value={password} onChange={setPassword} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-full bg-lime py-3 font-semibold text-pitch"
        >
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
        <button
          type="button"
          className="w-full text-sm font-semibold text-pitch underline"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError(null)
          }}
        >
          {mode === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="block text-sm font-medium text-pitch">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-2xl border border-pitch/15 px-4 py-3 outline-none focus:border-pitch"
      />
    </label>
  )
}
