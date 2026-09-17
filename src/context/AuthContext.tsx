import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readStorage, writeStorage } from '../lib/utils'
import type { SessionUser, UserAccount } from '../types'

const USERS_KEY = 'futstore_users'
const SESSION_KEY = 'futstore_session'

type AuthContextValue = {
  user: SessionUser | null
  login: (email: string, password: string) => string | null
  register: (name: string, email: string, password: string) => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() =>
    readStorage(SESSION_KEY, null),
  )

  const login = useCallback((email: string, password: string) => {
    const users = readStorage<UserAccount[]>(USERS_KEY, [])
    const found = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    )
    if (!found) return 'E-mail ou senha inválidos.'
    const session = { name: found.name, email: found.email }
    writeStorage(SESSION_KEY, session)
    setUser(session)
    return null
  }, [])

  const register = useCallback(
    (name: string, email: string, password: string) => {
      if (password.length < 4) return 'A senha precisa ter pelo menos 4 caracteres.'
      const users = readStorage<UserAccount[]>(USERS_KEY, [])
      if (users.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
        return 'Este e-mail já está cadastrado.'
      }
      const account: UserAccount = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }
      writeStorage(USERS_KEY, [...users, account])
      const session = { name: account.name, email: account.email }
      writeStorage(SESSION_KEY, session)
      setUser(session)
      return null
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return ctx
}
