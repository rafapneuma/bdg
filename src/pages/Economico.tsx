import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { PageHeader, Card } from '../components/ui'
import { euros, formatearFecha } from '../lib/format'
import { calcularResumen, deudaVivienda, estaAlCorriente } from '../lib/economia'
import { CONFIG_ECONOMICA } from '../data/mockData'

export default function Economico() {
  const { viviendas, movimientos, partidas, documentos } = useApp()
  const r = calcularResumen(viviendas, movimientos, partidas)

  const tuVivienda =
    viviendas.find((v) => v.id === CONFIG_ECONOMICA.viviendaEjemploId) ?? viviendas[0]
  const alCorriente = estaAlCorriente(tuVivienda)
  const docDe = (id?: string) => documentos.find((d) => d.id === id)

  return (
    <div>
      <PageHeader
        titulo="Económico"
        subtitulo={`Solo lectura · Actualizado ${CONFIG_ECONOMICA.ultimaActualizacion}`}
      />

      {/* Tu vivienda */}
      <div
        className={`mb-5 rounded-2xl p-5 text-white shadow-sm ${
          alCorriente
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-500'
            : 'bg-gradient-to-br from-terra-600 to-terra-500'
        }`}
      >
        <p className="text-sm opacity-90">Tu vivienda · {tuVivienda.referencia}</p>
        <p className="mt-2 text-3xl font-bold">
          {alCorriente ? 'Al corriente de pago' : euros(deudaVivienda(tuVivienda))}
        </p>
        <p className="mt-1 text-sm opacity-90">
          {alCorriente
            ? 'No tienes recibos pendientes. ¡Gracias!'
            : `${tuVivienda.recibosPendientes} recibo(s) pendiente(s)`}
        </p>
        <div className="mt-4 flex gap-6 border-t border-white/20 pt-3 text-sm">
          <div>
            <p className="opacity-80">Cuota mensual</p>
            <p className="font-semibold">{euros(tuVivienda.cuotaMensual)}</p>
          </div>
          <div>
            <p className="opacity-80">Próximo recibo</p>
            <p className="font-semibold">{CONFIG_ECONOMICA.proximoRecibo}</p>
          </div>
        </div>
      </div>

      {/* Resumen (calculado) */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Metric label="Saldo actual" valor={euros(r.saldoActual)} destacado />
        <Metric label="Fondo de reserva" valor={euros(r.fondoReserva)} />
        <Metric label="Ingresos previstos / año" valor={euros(r.ingresosPrevistosAnuales)} />
        <Metric label="Gastos previstos" valor={euros(r.gastosPrevistos)} />
      </div>

      {/* Estado de morosidad */}
      <Card className="mb-5">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-slate-800">Recibos y morosidad</p>
          <p className="text-lg font-bold text-brand-800">
            {r.morosidad.toFixed(1).replace('.', ',')}%
          </p>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {r.viviendasConDeuda} de {r.totalViviendas} viviendas con deuda ·{' '}
          {euros(r.deudaTotal)} pendiente de cobro
        </p>
        {r.viviendasConDeuda > 0 && (
          <ul className="mt-3 space-y-1.5">
            {viviendas
              .filter((v) => !estaAlCorriente(v))
              .map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm"
                >
                  <span className="text-slate-600">{v.referencia}</span>
                  <span className="font-semibold text-terra-600">
                    {euros(deudaVivienda(v))}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Card>

      {/* Partidas aprobadas */}
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Partidas / presupuestos aprobados
      </h2>
      <Card className="mb-5 !p-0">
        <ul className="divide-y divide-slate-100">
          {partidas.map((p) => {
            const doc = docDe(p.documentoId)
            return (
              <li key={p.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {p.concepto}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        p.pagada ? 'text-slate-400' : 'text-emerald-600'
                      }`}
                    >
                      {p.pagada ? '✓ Pagada' : '• Aprobada (pendiente de pago)'}
                    </span>
                  </div>
                  <p className="shrink-0 font-semibold text-slate-800">
                    {euros(p.importe)}
                  </p>
                </div>
                {doc && (
                  <Link
                    to="/documentos"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand-700"
                  >
                    📎 {doc.titulo}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Mini-libro: últimos movimientos */}
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Últimos movimientos
      </h2>
      <Card className="!p-0">
        <ul className="divide-y divide-slate-100">
          {movimientos.slice(0, 8).map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-700">{m.concepto}</p>
                <p className="text-xs text-slate-400">
                  {formatearFecha(m.fecha)} ·{' '}
                  {m.cuenta === 'fondo' ? 'Fondo de reserva' : 'Cuenta corriente'}
                </p>
              </div>
              <p
                className={`shrink-0 text-sm font-semibold ${
                  m.tipo === 'ingreso' ? 'text-emerald-600' : 'text-terra-600'
                }`}
              >
                {m.tipo === 'ingreso' ? '+' : '−'}
                {euros(m.importe)}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-400">
        Cifras inventadas para la demo · saldo y morosidad calculados automáticamente ·
        sin pagos reales
      </p>
    </div>
  )
}

function Metric({
  label,
  valor,
  destacado = false,
}: {
  label: string
  valor: string
  destacado?: boolean
}) {
  return (
    <Card>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${
          destacado ? 'text-brand-800' : 'text-slate-800'
        }`}
      >
        {valor}
      </p>
    </Card>
  )
}
