import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { ButtonLink } from '../components/ui/Button'
import { products } from '../data/products'

const reasons = [
  {
    title: 'Originais com nota fiscal',
    text: 'Todas as chuteiras são oficiais, com garantia do fabricante e rastreio no pedido.',
  },
  {
    title: 'Troca em 30 dias',
    text: 'Número errado? Você troca sem burocracia. O importante é o chute sair redondo.',
  },
  {
    title: 'Frete rápido',
    text: 'Envio para todo o Brasil. Pedidos até 14h saem no mesmo dia útil.',
  },
  {
    title: 'Especialistas em chuteira',
    text: 'Time que vive futebol e te ajuda a escolher o modelo certo para o seu campo.',
  },
]

export function HomePage() {
  const featured = products.filter((item) => item.featured)
  const bestsellers = products.filter((item) => item.bestseller)
  const offers = products.filter((item) => item.onSale).slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden bg-pitch text-white">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1800&q=80"
          alt="Chuteiras de futebol em campo"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/80 to-transparent" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-4 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime">
            Temporada 2026
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
            Encontre a chuteira perfeita para o seu jogo
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Campo, society ou futsal. Modelos oficiais Nike, Adidas, Puma, Mizuno e as
            favoritas do brasileiro — com desconto real e entrega rápida.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/chuteiras">Comprar agora</ButtonLink>
            <ButtonLink to="/ofertas" variant="ghost">
              Ver ofertas
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Campo', to: '/chuteiras?campo=Campo', text: 'Travas FG para gramado natural' },
            { label: 'Society', to: '/chuteiras?campo=Society', text: 'Sola TF para grama sintética' },
            { label: 'Futsal', to: '/chuteiras?campo=Futsal', text: 'Sola lisa para a quadra' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-3xl bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-lg font-extrabold text-pitch">{item.label}</p>
              <p className="text-sm text-neutral-600">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          kicker="Seleção da casa"
          title="Chuteiras em destaque"
          to="/chuteiras"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            kicker="O que está saindo"
            title="Mais vendidas"
            to="/chuteiras?ordenar=popularidade"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading kicker="Preço de camisa 10" title="Ofertas" to="/ofertas" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-pitch py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime">
            Por que a FutStore
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-extrabold">
            Porque chuteira boa muda o jogo — e a compra precisa ser tão certa quanto o passe.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {reasons.map((item) => (
              <article key={item.title} className="rounded-3xl bg-white/5 p-5">
                <h3 className="text-lg font-semibold text-lime">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeading({
  kicker,
  title,
  to,
}: {
  kicker: string
  title: string
  to: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pitch-light">
          {kicker}
        </p>
        <h2 className="text-3xl font-extrabold text-pitch">{title}</h2>
      </div>
      <Link to={to} className="hidden text-sm font-semibold text-pitch hover:underline sm:block">
        Ver tudo
      </Link>
    </div>
  )
}
