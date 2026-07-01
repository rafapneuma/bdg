import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Card, EstadoBadge } from '../components/ui'
import { ArrowLeft } from '../components/icons'
import { formatearFechaHora } from '../lib/format'

export default function IncidenciaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { incidencias } = useApp()
  const inc = incidencias.find((i) => i.id === id)

  if (!inc) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">No se ha encontrado la incidencia.</p>
        <button
          onClick={() => navigate('/incidencias')}
          className="mt-4 rounded-xl bg-brand-700 px-5 py-2.5 font-semibold text-white"
        >
          Volver a incidencias
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-brand-700"
      >
        <ArrowLeft />
        Volver
      </button>

      <div className="mb-3 flex items-center gap-2">
        <EstadoBadge estado={inc.estado} />
        <span className="text-xs text-slate-400">
          {formatearFechaHora(inc.fecha)}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-brand-800">{inc.titulo}</h1>

      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">📍 {inc.ubicacion}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">🏷️ {inc.categoria}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1">👤 {inc.autor}</span>
      </div>

      {inc.fotoUrl && (
        <img
          src={inc.fotoUrl}
          alt="Foto de la incidencia"
          className="mt-4 w-full rounded-2xl object-cover"
        />
      )}

      <Card className="mt-4">
        <p className="whitespace-pre-line leading-relaxed text-slate-700">
          {inc.descripcion}
        </p>
      </Card>

      {/* Seguimiento de ejemplo */}
      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Seguimiento
      </h2>
      <Card>
        <ol className="relative space-y-4 border-l-2 border-slate-100 pl-4">
          <li>
            <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-brand-600" />
            <p className="text-sm font-medium text-slate-700">Incidencia registrada</p>
            <p className="text-xs text-slate-400">{formatearFechaHora(inc.fecha)}</p>
          </li>
          {inc.estado !== 'Abierta' && (
            <li>
              <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-amber-500" />
              <p className="text-sm font-medium text-slate-700">
                Revisada por la administración
              </p>
              <p className="text-xs text-slate-400">Asignada al servicio correspondiente</p>
            </li>
          )}
          {inc.estado === 'Resuelta' && (
            <li>
              <span className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-emerald-500" />
              <p className="text-sm font-medium text-slate-700">Incidencia resuelta</p>
              <p className="text-xs text-slate-400">Trabajo completado</p>
            </li>
          )}
        </ol>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-400">
        Demo · el seguimiento es ilustrativo
      </p>
    </div>
  )
}
