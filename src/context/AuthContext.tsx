import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getApiError } from '../lib/api'
import type { SessionUser } from '../types'

type AuthContextValue = {
  user: SessionUser | null
  ready: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    api
      .me()
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.login(email, password)
      setUser(data.user)
      return null
    } catch (error) {
      return getApiError(error).error
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      try {
        await api.register(email, password, confirmPassword)
        return null
      } catch (error) {
        return getApiError(error).error
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      /* session is cleared locally anyway */
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return ctx
}
