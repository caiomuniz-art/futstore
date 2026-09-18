import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { readStorage, writeStorage } from '../../lib/utils'

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="text-2xl font-extrabold">
            Fut<span className="text-lime">Store</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Chuteiras oficiais e originais para campo, society e futsal. Frete para todo o Brasil
            e troca fácil em até 30 dias.
          </p>
        </div>
        <div>
          <p className="font-semibold">Loja</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            <Link to="/chuteiras" className="hover:text-lime">
              Catálogo
            </Link>
            <Link to="/ofertas" className="hover:text-lime">
              Ofertas da semana
            </Link>
            <Link to="/favoritos" className="hover:text-lime">
              Favoritos
            </Link>
            <Link to="/carrinho" className="hover:text-lime">
              Carrinho
            </Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Institucional</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/70">
            <Link to="/sobre" className="hover:text-lime">
              Sobre nós
            </Link>
            <Link to="/entrar" className="hover:text-lime">
              Minha conta
            </Link>
            <p>CNPJ 12.345.678/0001-90</p>
            <p>São Paulo — SP</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">Novidades</p>
          <p className="mt-3 text-sm text-white/70">
            Receba ofertas de chuteira no e-mail.
          </p>
          <NewsletterForm />
          <div className="mt-4 space-y-1 text-sm text-white/70">
            <p>seg a sáb, 9h às 18h</p>
            <p>contato@futstore.com.br</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} FutStore. Todos os direitos reservados.
      </div>
    </footer>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    const list = readStorage<string[]>('futstore_newsletter', [])
    const next = email.trim().toLowerCase()
    if (!list.includes(next)) writeStorage('futstore_newsletter', [...list, next])
    setDone(true)
    setEmail('')
  }

  if (done) {
    return <p className="mt-3 text-sm font-semibold text-lime">Inscrição salva neste navegador.</p>
  }

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="seu@email.com"
        className="w-full rounded-full bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
      />
      <button type="submit" className="rounded-full bg-lime px-3 py-2 text-sm font-semibold text-pitch">
        OK
      </button>
    </form>
  )
}
