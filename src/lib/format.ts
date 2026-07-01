export function formatearFecha(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatearFechaHora(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function fechaRelativa(iso: string): string {
  const d = new Date(iso).getTime()
  const ahora = Date.now()
  const dias = Math.round((ahora - d) / (1000 * 60 * 60 * 24))
  if (dias <= 0) return 'Hoy'
  if (dias === 1) return 'Ayer'
  if (dias < 7) return `Hace ${dias} días`
  if (dias < 30) return `Hace ${Math.round(dias / 7)} sem.`
  return formatearFecha(iso)
}

export function euros(n: number): string {
  return n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })
}
