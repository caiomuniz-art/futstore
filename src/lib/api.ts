export type ApiError = {
  error: string
  field?: string
  code?: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const data = (await response.json().catch(() => ({}))) as T & ApiError

  if (!response.ok) {
    const error = new Error(data.error || 'Não foi possível concluir a solicitação.') as Error & {
      payload: ApiError
    }
    error.payload = {
      error: data.error || 'Não foi possível concluir a solicitação.',
      field: data.field,
      code: data.code,
    }
    throw error
  }

  return data
}

export const api = {
  register(email: string, password: string, confirmPassword: string) {
    return request<{ ok: boolean; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, confirmPassword }),
    })
  },
  login(email: string, password: string) {
    return request<{ user: { id: string; email: string; name: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  me() {
    return request<{ user: { id: string; email: string; name: string } }>('/api/auth/me')
  },
  logout() {
    return request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
  },
}

export function getApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'payload' in error) {
    return (error as { payload: ApiError }).payload
  }
  if (error instanceof TypeError) {
    return {
      error: 'Não foi possível conectar ao servidor. Rode npm run dev e tente de novo.',
    }
  }
  return { error: 'Algo deu errado. Tente novamente.' }
}
