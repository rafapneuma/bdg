import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { calcularResumen } from '../lib/economia'
import { Card, Chip } from '../components/ui'
import {
  BellIcon,
  WrenchIcon,
  PollIcon,
  EuroIcon,
  ChevronRight,
} from '../components/icons'
import { fechaRelativa, euros } from '../lib/format'

export default function Home() {
  const { incidencias, sondeos, avisos, viviendas, movimientos, partidas } = useApp()
  const resumen = calcularResumen(viviendas, movimientos, partidas)
  const abiertas = incidencias.filter((i) => i.estado !== 'Resuelta').length
  const avisoDestacado = avisos.find((a) => a.destacado) ?? avisos[0]
  const sondeoActivo = sondeos.find((s) => s.estado === 'activo')
  const totalVotos = sondeoActivo?.opciones.reduce((a, o) => a + o.votos, 0) ?? 0

  return (
    <div className="space-y-5">
      {/* Bienvenida */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-800 to-brand-600 p-5 text-white shadow-sm">
        <p className="text-sm/6 text-brand-100">Bienvenido/a a tu comunidad</p>
        <h1 className="mt-1 text-2xl font-bold">Balcón del Golf</h1>
        <p className="mt-1 text-sm text-brand-100">
          Todo lo de la urbanización, en tu móvil.
        </p>
      </div>

      {/* Aviso destacado */}
      <Link to="/avisos" className="block">
        <Card className="border-l-4 border-terra-500 !ring-terra-100">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-full bg-terra-500/10 p-2 text-terra-600">
              <BellIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Chip>Último aviso</Chip>
                <span className="text-xs text-slate-400">
                  {fechaRelativa(avisoDestacado.fecha)}
                </span>
              </div>
              <p className="mt-1.5 font-semibold text-slate-800">
                {avisoDestacado.titulo}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                {avisoDestacado.contenido}
              </p>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300" />
          </div>
        </Card>
      </Link>

      {/* Accesos rápidos: incidencias + económico */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/incidencias">
          <Card className="h-full">
            <span className="inline-flex rounded-full bg-brand-50 p-2 text-brand-700">
              <WrenchIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-bold text-brand-800">{abiertas}</p>
            <p className="text-sm text-slate-500">
              {abiertas === 1 ? 'incidencia abierta' : 'incidencias abiertas'}
            </p>
          </Card>
        </Link>

        <Link to="/economico">
          <Card className="h-full">
            <span className="inline-flex rounded-full bg-emerald-50 p-2 text-emerald-600">
              <EuroIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-bold text-slate-800">
              {euros(resumen.saldoActual)}
            </p>
            <p className="text-sm text-slate-500">saldo actual</p>
          </Card>
        </Link>
      </div>

      {/* Sondeo activo */}
      {sondeoActivo && (
        <Link to="/sondeos" className="block">
          <Card>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-brand-50 p-2 text-brand-700">
                <PollIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <Chip>Sondeo activo</Chip>
                <p className="mt-1.5 font-semibold text-slate-800">
                  {sondeoActivo.titulo}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {totalVotos} votos · cierra el {sondeoActivo.cierra.replace(/^.*?(\d)/, '$1')}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
                  Votar ahora
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Card>
        </Link>
      )}

      <p className="pt-2 text-center text-xs text-slate-400">
        Demo con datos de ejemplo · Los cambios no se guardan
      </p>
    </div>
  )
}
