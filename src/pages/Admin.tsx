import { useState, type ReactNode } from 'react'
import { useApp } from '../context/AppContext'
import { ROLES } from '../roles'
import { PageHeader, Card } from '../components/ui'
import { CheckIcon } from '../components/icons'
import { euros } from '../lib/format'
import { calcularResumen, deudaVivienda, estaAlCorriente } from '../lib/economia'
import type { Documento, Movimiento } from '../types'

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
  const sinAcciones =
    !permisos.editarEconomico &&
    !permisos.gestionarDocumentos &&
    !permisos.crearAvisos &&
    !permisos.gestionarSondeos &&
    !permisos.gestionarIncidencias

  return (
    <div>
      <PageHeader titulo="Administración" subtitulo="Panel de gestión de la comunidad" />

      <div className={`rounded-2xl p-5 ${info.color}`}>
        <p className="text-sm opacity-90">Estás gestionando como</p>
        <p className="text-2xl font-bold">{info.nombre}</p>
        <p className="mt-0.5 text-sm opacity-90">{info.descripcion}</p>
      </div>

      <div className="mt-3">
        <ListaPermisos />
      </div>

      {sinAcciones && (
        <Card className="mt-5 text-center text-sm text-slate-500">
          Tu rol no tiene acciones de administración. Cambia de rol desde la cabecera
          para probar los paneles de gestión.
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
  const { viviendas, movimientos, partidas } = useApp()
  const r = calcularResumen(viviendas, movimientos, partidas)

  return (
    <>
      <Section
        titulo="Resumen (calculado)"
        descripcion="Estas cifras se calculan solas a partir de movimientos y viviendas"
      >
        <div className="grid grid-cols-2 gap-3 text-center">
          <Mini label="Saldo actual" valor={euros(r.saldoActual)} />
          <Mini label="Fondo de reserva" valor={euros(r.fondoReserva)} />
          <Mini label="Deuda pendiente" valor={euros(r.deudaTotal)} />
          <Mini label="Morosidad" valor={`${r.morosidad.toFixed(1).replace('.', ',')}%`} />
        </div>
      </Section>

      <MovimientosForm />
      <ViviendasPanel />
      <PartidasPanel />
    </>
  )
}

function Mini({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="rounded-xl bg-slate-50 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-brand-800">{valor}</p>
    </div>
  )
}

function MovimientosForm() {
  const { addMovimiento } = useApp()
  const [concepto, setConcepto] = useState('')
  const [tipo, setTipo] = useState<Movimiento['tipo']>('gasto')
  const [cuenta, setCuenta] = useState<Movimiento['cuenta']>('corriente')
  const [importe, setImporte] = useState('')
  const [hecho, setHecho] = useState(false)

  const puede = concepto.trim().length > 2 && Number(importe) > 0

  const registrar = () => {
    if (!puede) return
    addMovimiento({ concepto, tipo, cuenta, importe: Number(importe) })
    setConcepto('')
    setImporte('')
    setHecho(true)
    setTimeout(() => setHecho(false), 2000)
  }

  return (
    <Section
      titulo="Registrar movimiento"
      descripcion="Cada ingreso suma y cada gasto resta del saldo (mini-libro de cuentas)"
    >
      <label className="mb-2 block">
        <span className={labelCls}>Concepto</span>
        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Ej.: Factura electricidad julio"
          className={inputCls}
        />
      </label>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(['ingreso', 'gasto'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`rounded-lg py-2 text-sm font-semibold capitalize ${
                tipo === t ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {(['corriente', 'fondo'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCuenta(c)}
              className={`rounded-lg py-2 text-xs font-semibold ${
                cuenta === c ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              {c === 'corriente' ? 'Corriente' : 'Fondo'}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className={labelCls}>Importe (€)</span>
        <input
          type="number"
          inputMode="numeric"
          value={importe}
          onChange={(e) => setImporte(e.target.value)}
          className={inputCls}
        />
      </label>
      <button onClick={registrar} disabled={!puede} className={`${btnCls} mt-3`}>
        Registrar movimiento
      </button>
      {hecho && <Hecho texto="Movimiento registrado · saldo actualizado" />}
    </Section>
  )
}

function ViviendasPanel() {
  const { viviendas, editarCuotaVivienda, addReciboPendiente, registrarPagoVivienda } =
    useApp()
  const [selId, setSelId] = useState(viviendas[0]?.id ?? '')
  const v = viviendas.find((x) => x.id === selId) ?? viviendas[0]
  const [cuota, setCuota] = useState(String(v?.cuotaMensual ?? ''))
  const [aviso, setAviso] = useState('')

  if (!v) return null

  const seleccionar = (id: string) => {
    setSelId(id)
    const nv = viviendas.find((x) => x.id === id)
    setCuota(String(nv?.cuotaMensual ?? ''))
    setAviso('')
  }

  const flash = (t: string) => {
    setAviso(t)
    setTimeout(() => setAviso(''), 2000)
  }

  const alCorriente = estaAlCorriente(v)

  return (
    <Section
      titulo="Viviendas: cuotas y recibos"
      descripcion="El estado (al corriente / con deuda) se calcula solo según los recibos pendientes"
    >
      <label className="mb-3 block">
        <span className={labelCls}>Vivienda</span>
        <select
          value={selId}
          onChange={(e) => seleccionar(e.target.value)}
          className={`${inputCls} bg-white`}
        >
          {viviendas.map((x) => (
            <option key={x.id} value={x.id}>
              {x.referencia} — {x.propietario}
            </option>
          ))}
        </select>
      </label>

      <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
        <div>
          <p className="text-sm font-semibold text-slate-700">{v.propietario}</p>
          <p className="text-xs text-slate-400">
            {v.recibosPendientes} recibo(s) pendiente(s)
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            alCorriente
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-terra-500/10 text-terra-600'
          }`}
        >
          {alCorriente ? 'Al corriente' : `Debe ${euros(deudaVivienda(v))}`}
        </span>
      </div>

      <label className="mb-2 block">
        <span className={labelCls}>Cuota mensual (€)</span>
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            value={cuota}
            onChange={(e) => setCuota(e.target.value)}
            className={inputCls}
          />
          <button
            onClick={() => {
              editarCuotaVivienda(v.id, Number(cuota) || 0)
              flash('Cuota actualizada')
            }}
            className="shrink-0 rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white"
          >
            Guardar
          </button>
        </div>
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            addReciboPendiente(v.id)
            flash('Recibo pendiente añadido')
          }}
          className="rounded-xl bg-white py-2.5 text-sm font-semibold text-terra-600 ring-1 ring-slate-200"
        >
          + Recibo pendiente
        </button>
        <button
          onClick={() => {
            registrarPagoVivienda(v.id)
            flash('Deuda cobrada · ingreso registrado')
          }}
          disabled={alCorriente}
          className="rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          Cobrar deuda
        </button>
      </div>
      {aviso && <Hecho texto={aviso} />}
    </Section>
  )
}

function PartidasPanel() {
  const { partidas, documentos, addPartida, registrarPagoPartida } = useApp()
  const presupuestos = documentos.filter((d) => d.tipo === 'Presupuesto')
  const [concepto, setConcepto] = useState('')
  const [importe, setImporte] = useState('')
  const [docId, setDocId] = useState('')
  const [hecho, setHecho] = useState(false)
  const [pagoAviso, setPagoAviso] = useState('')

  const puede = concepto.trim().length > 2 && Number(importe) > 0

  const crear = () => {
    if (!puede) return
    addPartida({ concepto, importe: Number(importe), documentoId: docId || undefined })
    setConcepto('')
    setImporte('')
    setDocId('')
    setHecho(true)
    setTimeout(() => setHecho(false), 2500)
  }

  const docTitulo = (id?: string) => documentos.find((d) => d.id === id)?.titulo

  return (
    <Section
      titulo="Partidas y presupuestos aprobados"
      descripcion="Adjunta uno de los presupuestos subidos y, al pagar, se genera el gasto"
    >
      <label className="mb-2 block">
        <span className={labelCls}>Concepto de la partida</span>
        <input
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Ej.: Pintura de fachada"
          className={inputCls}
        />
      </label>
      <label className="mb-2 block">
        <span className={labelCls}>Importe (€)</span>
        <input
          type="number"
          inputMode="numeric"
          value={importe}
          onChange={(e) => setImporte(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="mb-1 block">
        <span className={labelCls}>Presupuesto adjunto (opcional)</span>
        <select
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          className={`${inputCls} bg-white`}
        >
          <option value="">— Sin adjuntar —</option>
          {presupuestos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.concepto ? `${d.concepto} · ` : ''}
              {d.titulo}
            </option>
          ))}
        </select>
      </label>
      <p className="mb-3 text-xs text-slate-400">
        ¿No está en la lista? Súbelo antes en «Subir documento» como tipo Presupuesto.
      </p>
      <button onClick={crear} disabled={!puede} className={btnCls}>
        Añadir partida
      </button>
      {hecho && <Hecho texto="Partida añadida" />}

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">Partidas actuales</p>
        <ul className="space-y-2">
          {partidas.map((p) => (
            <li key={p.id} className="rounded-xl bg-slate-50 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                  {p.concepto}
                </span>
                <span className="shrink-0 text-sm font-semibold text-slate-800">
                  {euros(p.importe)}
                </span>
              </div>
              {p.documentoId && (
                <p className="mt-1 truncate text-xs text-brand-700">
                  📎 {docTitulo(p.documentoId)}
                </p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`text-xs font-medium ${
                    p.pagada ? 'text-slate-400' : 'text-emerald-600'
                  }`}
                >
                  {p.pagada ? '✓ Pagada' : '• Pendiente de pago'}
                </span>
                {!p.pagada && (
                  <button
                    onClick={() => {
                      registrarPagoPartida(p.id)
                      setPagoAviso(p.id)
                      setTimeout(() => setPagoAviso(''), 2000)
                    }}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-slate-200"
                  >
                    Registrar pago
                  </button>
                )}
              </div>
              {pagoAviso === p.id && (
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  ✓ Gasto registrado en la cuenta corriente
                </p>
              )}
            </li>
          ))}
        </ul>
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
    <Section titulo="Publicar aviso" descripcion="Se mostrará en el tablón de la comunidad">
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

  const setOpcion = (i: number, val: string) =>
    setOpciones((prev) => prev.map((o, idx) => (idx === i ? val : o)))

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
  const [concepto, setConcepto] = useState('')
  const [hecho, setHecho] = useState(false)

  const puede = titulo.trim().length > 2

  const subir = () => {
    if (!puede) return
    addDocumento({ titulo, tipo, concepto: tipo === 'Presupuesto' ? concepto : undefined })
    setTitulo('')
    setTipo('Acta')
    setConcepto('')
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
          placeholder="Ej.: Presupuesto fugas — Fontanería López"
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
      {tipo === 'Presupuesto' && (
        <label className="mb-2 block">
          <span className={labelCls}>Concepto (agrupa la comparativa)</span>
          <input
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder="Ej.: Reparación de fugas de agua"
            className={inputCls}
          />
          <span className="mt-1 block text-xs text-slate-400">
            Varios presupuestos con el mismo concepto forman una comparativa.
          </span>
        </label>
      )}
      <button onClick={subir} disabled={!puede} className={`${btnCls} mt-1`}>
        Subir documento
      </button>
      {hecho && <Hecho texto="Documento añadido" />}
    </Section>
  )
}
