import type { ReactNode } from 'react'

export function AuthCard({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="relative overflow-hidden px-4 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-pitch/10 to-transparent" />
      <div className="auth-panel relative mx-auto w-full max-w-md">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pitch-light">
          {kicker}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-pitch md:text-4xl">{title}</h1>
        <p className="mt-2 text-neutral-600">{subtitle}</p>
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-pitch/5 md:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
