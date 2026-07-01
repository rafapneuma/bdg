import { datosEconomicos as d } from '../data/mockData'
import { PageHeader, Card } from '../components/ui'
import { euros } from '../lib/format'

export default function Economico() {
  const maxGasto = Math.max(...d.gastosPorCategoria.map((g) => g.importe))
  const alCorriente = d.tuVivienda.estado === 'al_corriente'

  return (
    <div>
      <PageHeader
        titulo="Económico"
        subtitulo={`Solo lectura · Actualizado ${d.ultimaActualizacion}`}
      />

      {/* Tu vivienda */}
      <div
        className={`mb-5 rounded-2xl p-5 text-white shadow-sm ${
          alCorriente
            ? 'bg-gradient-to-br from-emerald-600 to-emerald-500'
            : 'bg-gradient-to-br from-terra-600 to-terra-500'
        }`}
      >
        <p className="text-sm opacity-90">Tu vivienda · {d.tuVivienda.referencia}</p>
        <p className="mt-2 text-3xl font-bold">
          {alCorriente ? 'Al corriente de pago' : euros(d.tuVivienda.importePendiente)}
        </p>
        <p className="mt-1 text-sm opacity-90">
          {alCorriente
            ? 'No tienes recibos pendientes. ¡Gracias!'
            : 'Importe pendiente de pago'}
        </p>
        <div className="mt-4 flex gap-6 border-t border-white/20 pt-3 text-sm">
          <div>
            <p className="opacity-80">Cuota mensual</p>
            <p className="font-semibold">{euros(d.tuVivienda.cuotaMensual)}</p>
          </div>
          <div>
            <p className="opacity-80">Próximo recibo</p>
            <p className="font-semibold">{d.tuVivienda.proximoRecibo}</p>
          </div>
        </div>
      </div>

      {/* Resumen en tarjetas */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <Metric label="Saldo actual" valor={euros(d.saldoActual)} destacado />
        <Metric label="Fondo de reserva" valor={euros(d.fondoReserva)} />
        <Metric label="Previsión ingresos" valor={euros(d.previsionIngresos)} />
        <Metric label="Gastos previstos" valor={euros(d.gastosPrevistos)} />
      </div>

      {/* Presupuesto anual */}
      <Card className="mb-5">
        <div className="flex items-baseline justify-between">
          <p className="font-semibold text-slate-800">Presupuesto anual 2026</p>
          <p className="text-lg font-bold text-brand-800">{euros(d.presupuestoAnual)}</p>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {d.viviendas} viviendas · cuota {euros(d.cuotaMensual)}/mes · morosidad{' '}
          {d.morosidad}%
        </p>
      </Card>

      {/* Presupuestos aprobados */}
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Presupuestos aprobados
      </h2>
      <Card className="mb-5 !p-0">
        <ul className="divide-y divide-slate-100">
          {d.presupuestosAprobados.map((p) => (
            <li key={p.concepto} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 pr-3">
                <p className="truncate text-sm font-medium text-slate-700">
                  {p.concepto}
                </p>
                <span className="text-xs font-medium text-emerald-600">✓ {p.estado}</span>
              </div>
              <p className="shrink-0 font-semibold text-slate-800">{euros(p.importe)}</p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Gastos por categoría */}
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Gastos previstos por categoría
      </h2>
      <Card>
        <div className="space-y-3">
          {d.gastosPorCategoria.map((g) => (
            <div key={g.categoria}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-slate-600">{g.categoria}</span>
                <span className="font-semibold text-slate-800">{euros(g.importe)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${(g.importe / maxGasto) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-400">
        Cifras inventadas para la demo · Esta sección no permite pagos
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
