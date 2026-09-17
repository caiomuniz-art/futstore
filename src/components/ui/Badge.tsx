import type { ReactNode } from 'react'

export function Badge({
  children,
  tone = 'lime',
}: {
  children: ReactNode
  tone?: 'lime' | 'dark' | 'red'
}) {
  const tones = {
    lime: 'bg-lime text-pitch',
    dark: 'bg-pitch text-white',
    red: 'bg-red-600 text-white',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
