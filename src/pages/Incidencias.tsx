import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageHeader, Card, EstadoBadge } from '../components/ui'
import { PlusIcon, ChevronRight, CameraIcon, CheckIcon } from '../components/icons'
import { fechaRelativa } from '../lib/format'
import type { EstadoIncidencia } from '../types'

const FILTROS: (EstadoIncidencia | 'Todas')[] = [
  'Todas',
  'Abierta',
  'En curso',
  'Resuelta',
]

export default function Incidencias() {
  const { incidencias } = useApp()
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]>('Todas')
  const [formAbierto, setFormAbierto] = useState(false)

  const lista =
    filtro === 'Todas'
      ? incidencias
      : incidencias.filter((i) => i.estado === filtro)

  return (
    <div>
      <PageHeader
        titulo="Incidencias"
        subtitulo="Averías y desperfectos de las zonas comunes"
      />

      {/* Filtros */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filtro === f
                ? 'bg-brand-700 text-white'
                : 'bg-white text-slate-500 ring-1 ring-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {lista.map((inc) => (
          <Link key={inc.id} to={`/incidencias/${inc.id}`} className="block">
            <Card className="transition-shadow active:shadow-md">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <EstadoBadge estado={inc.estado} />
                    <span className="text-xs text-slate-400">
                      {fechaRelativa(inc.fecha)}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{inc.titulo}</p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                    {inc.descripcion}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    📍 {inc.ubicacion} · {inc.categoria}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300" />
              </div>
            </Card>
          </Link>
        ))}
        {lista.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No hay incidencias {filtro !== 'Todas' && `en estado «${filtro}»`}.
          </p>
        )}
      </div>

      {/* Botón flotante Nueva incidencia */}
      <button
        onClick={() => setFormAbierto(true)}
        className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-700/30 active:bg-brand-800"
      >
        <PlusIcon />
        Nueva incidencia
      </button>

      {formAbierto && <NuevaIncidenciaModal onClose={() => setFormAbierto(false)} />}
    </div>
  )
}

const CATEGORIAS = [
  'Iluminación',
  'Fontanería',
  'Limpieza',
  'Accesos',
  'Jardinería',
  'Mantenimiento',
  'Otros',
]

function NuevaIncidenciaModal({ onClose }: { onClose: () => void }) {
  const { addIncidencia } = useApp()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS[0])
  const [ubicacion, setUbicacion] = useState('')
  const [fotoUrl, setFotoUrl] = useState<string | undefined>()
  const [enviado, setEnviado] = useState(false)

  const puedeEnviar = titulo.trim().length > 2 && descripcion.trim().length > 2

  const onFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFotoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const enviar = () => {
    if (!puedeEnviar) return
    addIncidencia({ titulo, descripcion, categoria, ubicacion, fotoUrl })
    setEnviado(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center">
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        {enviado ? (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckIcon className="h-8 w-8" />
            </span>
            <p className="mt-4 text-lg font-semibold text-slate-800">
              ¡Incidencia enviada!
            </p>
            <p className="mt-1 text-sm text-slate-500">
              La verás la primera en la lista (solo en esta demo).
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-800">Nueva incidencia</h2>
              <button
                onClick={onClose}
                className="rounded-full px-3 py-1 text-sm font-medium text-slate-400"
              >
                Cancelar
              </button>
            </div>

            <label className="mb-3 block">
              <span className="mb-1 block text-sm font-medium text-slate-600">
                Título
              </span>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej.: Farola fundida en el paseo"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            <div className="mb-3 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600">
                  Categoría
                </span>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600">
                  Ubicación
                </span>
                <input
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej.: Bloque 3"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </label>
            </div>

            <label className="mb-3 block">
              <span className="mb-1 block text-sm font-medium text-slate-600">
                Descripción
              </span>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                placeholder="Describe qué ocurre y desde cuándo…"
                className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            {/* Foto opcional */}
            <div className="mb-5">
              <span className="mb-1 block text-sm font-medium text-slate-600">
                Foto (opcional)
              </span>
              {fotoUrl ? (
                <div className="relative">
                  <img
                    src={fotoUrl}
                    alt="Foto de la incidencia"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                  <button
                    onClick={() => setFotoUrl(undefined)}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-6 text-slate-500">
                  <CameraIcon />
                  <span className="text-sm font-medium">Añadir foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              onClick={enviar}
              disabled={!puedeEnviar}
              className="w-full rounded-xl bg-brand-700 py-3.5 text-base font-semibold text-white transition-opacity active:bg-brand-800 disabled:opacity-40"
            >
              Enviar incidencia
            </button>
          </>
        )}
      </div>
    </div>
  )
}
