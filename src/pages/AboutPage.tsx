import { ButtonLink } from '../components/ui/Button'

export function AboutPage() {
  return (
    <div>
      <section className="bg-pitch py-16 text-white">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lime">Sobre nós</p>
          <h1 className="mt-3 text-4xl font-extrabold">A loja de quem vive o jogo</h1>
          <p className="mt-4 text-lg text-white/80">
            A FutStore nasceu de uma pelada de quarta-feira e da frustração de comprar chuteira
            errada. A gente testou, errou o número, rasgou a sola no society e decidiu montar uma
            loja só com o que realmente funciona no gramado brasileiro.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-3">
        {[
          ['2019', 'Primeira loja física em São Paulo e o catálogo online no mesmo ano.'],
          ['+40 mil', 'Pares enviados para os 26 estados e o Distrito Federal.'],
          ['30 dias', 'Para trocar o número sem drama. Jogo continua.'],
        ].map(([stat, text]) => (
          <article key={stat} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-3xl font-extrabold text-pitch">{stat}</p>
            <p className="mt-2 text-neutral-600">{text}</p>
          </article>
        ))}
      </section>
      <div className="pb-16 text-center">
        <ButtonLink to="/chuteiras">Ir para o catálogo</ButtonLink>
      </div>
    </div>
  )
}
