import type { ReactNode } from 'react'
import type { EstadoIncidencia } from '../types'

export function PageHeader({
  titulo,
  subtitulo,
}: {
  titulo: string
  subtitulo?: string
}) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-brand-800">{titulo}</h1>
      {subtitulo && <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>}
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 ${className}`}
    >
      {children}
    </div>
  )
}

const estadoStyles: Record<EstadoIncidencia, string> = {
  Abierta: 'bg-red-100 text-red-700 ring-red-200',
  'En curso': 'bg-amber-100 text-amber-800 ring-amber-200',
  Resuelta: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

export function EstadoBadge({ estado }: { estado: EstadoIncidencia }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${estadoStyles[estado]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {estado}
    </span>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
      {children}
    </span>
  )
}
