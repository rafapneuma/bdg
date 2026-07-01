import { useApp } from '../context/AppContext'
import { PageHeader, Card, Chip } from '../components/ui'
import { CheckIcon } from '../components/icons'
import type { Sondeo } from '../types'

export default function Sondeos() {
  const { sondeos } = useApp()
  const activos = sondeos.filter((s) => s.estado === 'activo')
  const cerrados = sondeos.filter((s) => s.estado === 'cerrado')

  return (
    <div>
      <PageHeader
        titulo="Sondeos"
        subtitulo="Tu opinión cuenta para las decisiones de la comunidad"
      />

      <div className="space-y-4">
        {activos.map((s) => (
          <SondeoCard key={s.id} sondeo={s} />
        ))}
      </div>

      {cerrados.length > 0 && (
        <>
          <h2 className="mb-3 mt-7 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Sondeos cerrados
          </h2>
          <div className="space-y-4">
            {cerrados.map((s) => (
              <SondeoCard key={s.id} sondeo={s} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function SondeoCard({ sondeo }: { sondeo: Sondeo }) {
  const { votar, yaVotado } = useApp()
  const cerrado = sondeo.estado === 'cerrado'
  const votoElegido = yaVotado[sondeo.id]
  const mostrarResultados = cerrado || Boolean(votoElegido)
  const total = sondeo.opciones.reduce((a, o) => a + o.votos, 0)
  const ganadora = Math.max(...sondeo.opciones.map((o) => o.votos))

  return (
    <Card>
      <div className="mb-2 flex items-center gap-2">
        {cerrado ? (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            Cerrado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Activo
          </span>
        )}
        <Chip>{total} votos</Chip>
      </div>

      <h3 className="text-lg font-bold text-slate-800">{sondeo.titulo}</h3>
      <p className="mt-1 text-sm text-slate-500">{sondeo.descripcion}</p>

      <div className="mt-4 space-y-2.5">
        {sondeo.opciones.map((o) => {
          const pct = total > 0 ? Math.round((o.votos / total) * 100) : 0
          const esGanadora = o.votos === ganadora && total > 0
          const esMiVoto = votoElegido === o.id

          if (mostrarResultados) {
            return (
              <div key={o.id} className="relative">
                <div className="relative overflow-hidden rounded-xl bg-slate-100">
                  <div
                    className={`h-full py-2.5 transition-all duration-500 ${
                      esGanadora ? 'bg-brand-600' : 'bg-brand-200'
                    }`}
                    style={{ width: `${Math.max(pct, 6)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3.5">
                    <span
                      className={`flex items-center gap-1.5 text-sm font-medium ${
                        esGanadora ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {esMiVoto && <CheckIcon className="h-4 w-4" />}
                      {o.texto}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        esGanadora ? 'text-white' : 'text-slate-600'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <button
              key={o.id}
              onClick={() => votar(sondeo.id, o.id)}
              className="flex w-full items-center justify-between rounded-xl border-2 border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors active:border-brand-500 active:bg-brand-50"
            >
              {o.texto}
              <span className="h-5 w-5 rounded-full border-2 border-slate-300" />
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {cerrado
          ? sondeo.cierra
          : votoElegido
            ? '✓ Ya has votado (gracias). Resultados en directo.'
            : `Cierra el ${sondeo.cierra}`}
      </p>
    </Card>
  )
}
