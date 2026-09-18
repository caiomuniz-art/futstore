import { createHmac, pbkdf2, randomBytes, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import http from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const pbkdf2Async = promisify(pbkdf2)
const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const dataDir = join(__dirname, 'data')
const usersFile = join(dataDir, 'users.json')

loadEnv(join(rootDir, '.env'))

const port = Number(process.env.PORT) || 3001
const jwtSecret = process.env.JWT_SECRET ?? ''
if (jwtSecret.length < 16) {
  console.error('Crie um arquivo .env com JWT_SECRET (pelo menos 16 caracteres). Veja .env.example.')
  process.exit(1)
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const cookieName = 'futstore_token'
const pbkdf2Rounds = 120_000

function loadEnv(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 1) continue
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

function loadUsers() {
  if (!existsSync(usersFile)) return []
  try {
    const parsed = JSON.parse(readFileSync(usersFile, 'utf8'))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  mkdirSync(dataDir, { recursive: true })
  writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.email.split('@')[0],
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = await pbkdf2Async(password, salt, pbkdf2Rounds, 32, 'sha256')
  return `pbkdf2$${salt.toString('hex')}$${hash.toString('hex')}`
}

async function verifyPassword(password, stored) {
  const parts = String(stored).split('$')
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') return false
  const salt = Buffer.from(parts[1], 'hex')
  const expected = Buffer.from(parts[2], 'hex')
  const hash = await pbkdf2Async(password, salt, pbkdf2Rounds, 32, 'sha256')
  if (hash.length !== expected.length) return false
  return timingSafeEqual(hash, expected)
}

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url')
}

function signToken(payload) {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = toBase64Url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    }),
  )
  const sig = createHmac('sha256', jwtSecret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

function verifyToken(token) {
  const [header, body, signature] = String(token).split('.')
  if (!header || !body || !signature) return null
  const expected = createHmac('sha256', jwtSecret).update(`${header}.${body}`).digest('base64url')
  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

function parseCookies(header) {
  const cookies = {}
  for (const part of String(header ?? '').split(';')) {
    const index = part.indexOf('=')
    if (index < 1) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    cookies[key] = decodeURIComponent(value)
  }
  return cookies
}

function cookieHeader(value, maxAgeSeconds) {
  const parts = [
    `${cookieName}=${encodeURIComponent(value)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

function send(res, status, body, extra = {}) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data),
    ...extra,
  })
  res.end(data)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > 32_768) {
        reject(new Error('payload'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        reject(new Error('json'))
      }
    })
  })
}

function readSession(req) {
  const token = parseCookies(req.headers.cookie)[cookieName]
  if (!token) return null
  return verifyToken(token)
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    const path = url.pathname
    const method = req.method ?? 'GET'

    if (method === 'POST' && path === '/api/auth/register') {
      const body = await readBody(req)
      const email = String(body.email ?? '')
        .trim()
        .toLowerCase()
      const password = String(body.password ?? '')
      const confirmPassword = String(body.confirmPassword ?? '')

      if (!emailPattern.test(email)) {
        return send(res, 400, { error: 'Informe um e-mail válido.', field: 'email' })
      }
      if (!password) {
        return send(res, 400, { error: 'A senha é obrigatória.', field: 'password' })
      }
      if (password.length < 8) {
        return send(res, 400, {
          error: 'A senha deve ter pelo menos 8 caracteres.',
          field: 'password',
        })
      }
      if (password !== confirmPassword) {
        return send(res, 400, {
          error: 'A confirmação de senha deve ser exatamente igual à senha.',
          field: 'confirmPassword',
        })
      }

      const users = loadUsers()
      if (users.some((user) => user.email === email)) {
        return send(res, 409, {
          error: 'Este e-mail já está cadastrado. Entre ou use outro e-mail.',
          field: 'email',
          code: 'EMAIL_TAKEN',
        })
      }

      const user = {
        id: crypto.randomUUID(),
        email,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      }
      saveUsers([...users, user])
      return send(res, 201, { ok: true, message: 'Conta criada. Entre para continuar.' })
    }

    if (method === 'POST' && path === '/api/auth/login') {
      const body = await readBody(req)
      const email = String(body.email ?? '')
        .trim()
        .toLowerCase()
      const password = String(body.password ?? '')

      if (!emailPattern.test(email)) {
        return send(res, 400, { error: 'Informe um e-mail válido.', field: 'email' })
      }
      if (!password) {
        return send(res, 400, { error: 'A senha é obrigatória.', field: 'password' })
      }

      const users = loadUsers()
      const user = users.find((item) => item.email === email)
      if (!user) {
        return send(res, 404, {
          error: 'Conta não encontrada. Crie uma conta primeiro.',
          code: 'NOT_FOUND',
        })
      }

      const matches = await verifyPassword(password, user.passwordHash)
      if (!matches) {
        return send(res, 401, { error: 'Senha incorreta.', code: 'BAD_PASSWORD' })
      }

      return send(res, 200, { user: publicUser(user) }, {
        'Set-Cookie': cookieHeader(signToken({ sub: user.id, email: user.email }), 7 * 24 * 60 * 60),
      })
    }

    if (method === 'GET' && path === '/api/auth/me') {
      const session = readSession(req)
      if (!session?.sub) {
        return send(res, 401, { error: 'Não autenticado.', code: 'UNAUTHENTICATED' })
      }
      const user = loadUsers().find((item) => item.id === session.sub)
      if (!user) {
        return send(res, 401, { error: 'Sessão inválida.', code: 'UNAUTHENTICATED' }, {
          'Set-Cookie': cookieHeader('', 0),
        })
      }
      return send(res, 200, { user: publicUser(user) })
    }

    if (method === 'POST' && path === '/api/auth/logout') {
      return send(res, 200, { ok: true }, { 'Set-Cookie': cookieHeader('', 0) })
    }

    send(res, 404, { error: 'Rota não encontrada.' })
  } catch (error) {
    if (error instanceof Error && error.message === 'json') {
      return send(res, 400, { error: 'Dados inválidos.' })
    }
    console.error(error)
    send(res, 500, { error: 'Erro interno do servidor.' })
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`FutStore auth API em http://127.0.0.1:${port}`)
})
