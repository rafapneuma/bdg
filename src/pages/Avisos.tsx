import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageHeader, Card } from '../components/ui'
import { BellIcon, ChevronRight } from '../components/icons'
import { formatearFecha } from '../lib/format'

const categoriaColor: Record<string, string> = {
  Urgente: 'bg-terra-500/10 text-terra-600',
  Mantenimiento: 'bg-amber-100 text-amber-700',
  Junta: 'bg-brand-50 text-brand-700',
  Información: 'bg-slate-100 text-slate-600',
}

export default function Avisos() {
  const { avisos } = useApp()
  // El aviso destacado empieza desplegado
  const destacadoId = avisos.find((a) => a.destacado)?.id
  const [abierto, setAbierto] = useState<string | null>(destacadoId ?? null)

  return (
    <div>
      <PageHeader titulo="Avisos" subtitulo="Tablón de anuncios de la comunidad" />

      <div className="space-y-3">
        {avisos.map((av) => {
          const expandido = abierto === av.id
          return (
            <Card
              key={av.id}
              className={av.destacado ? 'border-l-4 border-terra-500' : ''}
            >
              <button
                onClick={() => setAbierto(expandido ? null : av.id)}
                className="flex w-full items-start gap-3 text-left"
              >
                {av.destacado && (
                  <span className="mt-0.5 shrink-0 rounded-full bg-terra-500/10 p-2 text-terra-600">
                    <BellIcon className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        categoriaColor[av.categoria] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {av.categoria}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatearFecha(av.fecha)}
                    </span>
                  </div>
                  <p className="mt-1.5 font-semibold text-slate-800">{av.titulo}</p>
                  {!expandido && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
                      {av.contenido}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className={`mt-1 h-5 w-5 shrink-0 text-slate-300 transition-transform ${
                    expandido ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {expandido && (
                <p className="mt-3 whitespace-pre-line border-t border-slate-100 pt-3 leading-relaxed text-slate-700">
                  {av.contenido}
                </p>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
