import { useState, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { ROLES } from '../roles'
import { PageHeader, Card } from '../components/ui'
import { CheckIcon } from '../components/icons'
import { euros } from '../lib/format'
import type { Documento } from '../types'

const inputCls =
  'w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
const labelCls = 'mb-1 block text-sm font-medium text-slate-600'
const btnCls =
  'w-full rounded-xl bg-brand-700 py-3 text-base font-semibold text-white transition-opacity active:bg-brand-800 disabled:opacity-40'

function Section({
  titulo,
  descripcion,
  children,
}: {
  titulo: string
  descripcion: string
  children: ReactNode
}) {
  return (
    <section className="mt-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
        {titulo}
      </h2>
      <p className="mb-2 text-xs text-slate-400">{descripcion}</p>
      <Card>{children}</Card>
    </section>
  )
}

function Hecho({ texto }: { texto: string }) {
  return (
    <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
      <CheckIcon className="h-4 w-4" />
      {texto}
    </p>
  )
}

export default function Admin() {
  const { rol, permisos } = useApp()
  const info = ROLES[rol]

  return (
    <div>
      <PageHeader
        titulo="Administración"
        subtitulo="Panel de gestión de la comunidad"
      />

      {/* Tarjeta de rol activo + permisos */}
      <div className={`rounded-2xl p-5 ${info.color}`}>
        <p className="text-sm opacity-90">Estás gestionando como</p>
        <p className="text-2xl font-bold">{info.nombre}</p>
        <p className="mt-0.5 text-sm opacity-90">{info.descripcion}</p>
      </div>

      <div className="mt-3">
        <ListaPermisos />
      </div>

      {!permisos.editarEconomico &&
        !permisos.gestionarDocumentos &&
        !permisos.crearAvisos &&
        !permisos.gestionarSondeos &&
        !permisos.gestionarIncidencias && (
          <Card className="mt-5 text-center text-sm text-slate-500">
            Tu rol no tiene acciones de administración. Cambia de rol desde la
            cabecera para probar los paneles de gestión.
          </Card>
        )}

      {permisos.editarEconomico && <PanelEconomico />}
      {permisos.crearAvisos && <PanelAvisos />}
      {permisos.gestionarSondeos && <PanelSondeos />}
      {permisos.gestionarDocumentos && <PanelDocumentos />}

      <p className="mt-6 text-center text-xs text-slate-400">
        Demo · los cambios se ven al instante pero no se guardan al recargar
      </p>
    </div>
  )
}

function ListaPermisos() {
  const { permisos } = useApp()
  const filas: { label: string; ok: boolean }[] = [
    { label: 'Editar económico', ok: permisos.editarEconomico },
    { label: 'Gestionar documentos', ok: permisos.gestionarDocumentos },
    { label: 'Crear avisos', ok: permisos.crearAvisos },
    { label: 'Crear/cerrar sondeos', ok: permisos.gestionarSondeos },
    { label: 'Gestionar incidencias', ok: permisos.gestionarIncidencias },
  ]
  return (
    <Card className="!p-3">
      <div className="flex flex-wrap gap-2">
        {filas.map((f) => (
          <span
            key={f.label}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              f.ok
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-400 line-through'
            }`}
          >
            {f.ok ? '✓' : '✕'} {f.label}
          </span>
        ))}
      </div>
    </Card>
  )
}

// ── Panel Económico ────────────────────────────────────────────
function PanelEconomico() {
  const { economico, updateEconomico, addPresupuesto } = useApp()
  const [saldo, setSaldo] = useState(String(economico.saldoActual))
  const [fondo, setFondo] = useState(String(economico.fondoReserva))
  const [guardado, setGuardado] = useState(false)

  const pendiente = economico.tuVivienda.estado === 'pendiente'
  const [importe, setImporte] = useState(String(economico.tuVivienda.importePendiente))

  const [concepto, setConcepto] = useState('')
  const [impPres, setImpPres] = useState('')
  const [presAdd, setPresAdd] = useState(false)

  const guardarCifras = () => {
    updateEconomico({
      saldoActual: Number(saldo) || 0,
      fondoReserva: Number(fondo) || 0,
    })
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  const setEstadoVivienda = (nuevoPendiente: boolean) => {
    updateEconomico({
      tuVivienda: {
        ...economico.tuVivienda,
        estado: nuevoPendiente ? 'pendiente' : 'al_corriente',
        importePendiente: nuevoPendiente ? Number(importe) || 0 : 0,
      },
    })
  }

  const guardarPresupuesto = () => {
    if (!concepto.trim()) return
    addPresupuesto(concepto.trim(), Number(impPres) || 0)
    setConcepto('')
    setImpPres('')
    setPresAdd(true)
    setTimeout(() => setPresAdd(false), 2000)
  }

  return (
    <Section
      titulo="Gestión económica"
      descripcion="Solo el administrador puede modificar estos datos"
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={labelCls}>Saldo actual (€)</span>
          <input
            type="number"
            inputMode="numeric"
            value={saldo}
            onChange={(e) => setSaldo(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Fondo de reserva (€)</span>
          <input
            type="number"
            inputMode="numeric"
            value={fondo}
            onChange={(e) => setFondo(e.target.value)}
            className={inputCls}
          />
        </label>
      </div>
      <button onClick={guardarCifras} className={`${btnCls} mt-3`}>
        Guardar cifras
      </button>
      {guardado && <Hecho texto="Datos económicos actualizados" />}

      {/* Estado de deuda de la vivienda de ejemplo */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Deuda de «{economico.tuVivienda.referencia}»
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setEstadoVivienda(false)}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
              !pendiente
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            Al corriente
          </button>
          <button
            onClick={() => setEstadoVivienda(true)}
            className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
              pendiente
                ? 'bg-terra-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            Con deuda
          </button>
        </div>
        {pendiente && (
          <label className="mt-2 block">
            <span className={labelCls}>Importe pendiente (€)</span>
            <input
              type="number"
              inputMode="numeric"
              value={importe}
              onChange={(e) => setImporte(e.target.value)}
              onBlur={() => setEstadoVivienda(true)}
              className={inputCls}
            />
          </label>
        )}
      </div>

      {/* Añadir presupuesto */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Añadir presupuesto aprobado
        </p>
        <label className="mb-2 block">
          <span className={labelCls}>Concepto</span>
          <input
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder="Ej.: Pintura de fachada"
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className={labelCls}>Importe (€)</span>
          <input
            type="number"
            inputMode="numeric"
            value={impPres}
            onChange={(e) => setImpPres(e.target.value)}
            className={inputCls}
          />
        </label>
        <button
          onClick={guardarPresupuesto}
          disabled={!concepto.trim()}
          className={`${btnCls} mt-3`}
        >
          Añadir presupuesto
        </button>
        {presAdd && <Hecho texto="Presupuesto añadido a la lista" />}
        <p className="mt-2 text-xs text-slate-400">
          Total presupuestos: {euros(
            economico.presupuestosAprobados.reduce((a, p) => a + p.importe, 0),
          )}
        </p>
      </div>
    </Section>
  )
}

// ── Panel Avisos ───────────────────────────────────────────────
const CATEGORIAS_AVISO = ['Urgente', 'Mantenimiento', 'Junta', 'Información']

function PanelAvisos() {
  const { addAviso } = useApp()
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [categoria, setCategoria] = useState(CATEGORIAS_AVISO[3])
  const [destacado, setDestacado] = useState(false)
  const [hecho, setHecho] = useState(false)

  const puede = titulo.trim().length > 2 && contenido.trim().length > 2

  const publicar = () => {
    if (!puede) return
    addAviso({ titulo, contenido, categoria, destacado })
    setTitulo('')
    setContenido('')
    setDestacado(false)
    setHecho(true)
    setTimeout(() => setHecho(false), 2500)
  }

  return (
    <Section
      titulo="Publicar aviso"
      descripcion="Se mostrará en el tablón de la comunidad"
    >
      <label className="mb-2 block">
        <span className={labelCls}>Título</span>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej.: Corte de agua programado"
          className={inputCls}
        />
      </label>
      <label className="mb-2 block">
        <span className={labelCls}>Categoría</span>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={`${inputCls} bg-white`}
        >
          {CATEGORIAS_AVISO.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="mb-2 block">
        <span className={labelCls}>Contenido</span>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={4}
          placeholder="Escribe el comunicado…"
          className={`${inputCls} resize-none`}
        />
      </label>
      <label className="mb-3 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Marcar como destacado
      </label>
      <button onClick={publicar} disabled={!puede} className={btnCls}>
        Publicar aviso
      </button>
      {hecho && <Hecho texto="Aviso publicado en el tablón" />}
    </Section>
  )
}

// ── Panel Sondeos ──────────────────────────────────────────────
function PanelSondeos() {
  const { sondeos, addSondeo, cerrarSondeo } = useApp()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [opciones, setOpciones] = useState(['', ''])
  const [hecho, setHecho] = useState(false)

  const opcionesValidas = opciones.filter((o) => o.trim())
  const puede = titulo.trim().length > 2 && opcionesValidas.length >= 2

  const crear = () => {
    if (!puede) return
    addSondeo({ titulo, descripcion, opciones })
    setTitulo('')
    setDescripcion('')
    setOpciones(['', ''])
    setHecho(true)
    setTimeout(() => setHecho(false), 2500)
  }

  const setOpcion = (i: number, v: string) =>
    setOpciones((prev) => prev.map((o, idx) => (idx === i ? v : o)))

  const activos = sondeos.filter((s) => s.estado === 'activo')

  return (
    <Section titulo="Sondeos" descripcion="Crea nuevas votaciones o cierra las activas">
      <label className="mb-2 block">
        <span className={labelCls}>Pregunta</span>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej.: ¿Cambiamos el color de las zonas comunes?"
          className={inputCls}
        />
      </label>
      <label className="mb-2 block">
        <span className={labelCls}>Descripción (opcional)</span>
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={inputCls}
        />
      </label>
      <span className={labelCls}>Opciones</span>
      <div className="space-y-2">
        {opciones.map((o, i) => (
          <input
            key={i}
            value={o}
            onChange={(e) => setOpcion(i, e.target.value)}
            placeholder={`Opción ${i + 1}`}
            className={inputCls}
          />
        ))}
      </div>
      {opciones.length < 4 && (
        <button
          onClick={() => setOpciones((prev) => [...prev, ''])}
          className="mt-2 text-sm font-medium text-brand-700"
        >
          + Añadir opción
        </button>
      )}
      <button onClick={crear} disabled={!puede} className={`${btnCls} mt-3`}>
        Crear sondeo
      </button>
      {hecho && <Hecho texto="Sondeo creado y activo" />}

      {activos.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Sondeos activos</p>
          <ul className="space-y-2">
            {activos.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                  {s.titulo}
                </span>
                <button
                  onClick={() => cerrarSondeo(s.id)}
                  className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-terra-600 ring-1 ring-slate-200"
                >
                  Cerrar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}

// ── Panel Documentos ───────────────────────────────────────────
const TIPOS_DOC: Documento['tipo'][] = [
  'Acta',
  'Presupuesto',
  'Factura',
  'Circular',
  'Contrato',
]

function PanelDocumentos() {
  const { addDocumento } = useApp()
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<Documento['tipo']>('Acta')
  const [hecho, setHecho] = useState(false)

  const puede = titulo.trim().length > 2

  const subir = () => {
    if (!puede) return
    addDocumento({ titulo, tipo })
    setTitulo('')
    setTipo('Acta')
    setHecho(true)
    setTimeout(() => setHecho(false), 2500)
  }

  return (
    <Section
      titulo="Subir documento"
      descripcion="Aparecerá en la sección Documentos (demo, sin archivo real)"
    >
      <label className="mb-2 block">
        <span className={labelCls}>Título del documento</span>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej.: Acta reunión extraordinaria julio"
          className={inputCls}
        />
      </label>
      <label className="mb-2 block">
        <span className={labelCls}>Tipo</span>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as Documento['tipo'])}
          className={`${inputCls} bg-white`}
        >
          {TIPOS_DOC.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <button onClick={subir} disabled={!puede} className={btnCls}>
        Subir documento
      </button>
      {hecho && <Hecho texto="Documento añadido" />}
    </Section>
  )
}
