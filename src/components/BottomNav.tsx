import { NavLink } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { tieneAccesoAdmin } from '../roles'
import {
  HomeIcon,
  WrenchIcon,
  PollIcon,
  BellIcon,
  DocIcon,
  EuroIcon,
  ShieldIcon,
} from './icons'

const baseItems = [
  { to: '/', label: 'Inicio', Icon: HomeIcon, end: true },
  { to: '/incidencias', label: 'Incidencias', Icon: WrenchIcon, end: false },
  { to: '/sondeos', label: 'Sondeos', Icon: PollIcon, end: false },
  { to: '/avisos', label: 'Avisos', Icon: BellIcon, end: false },
  { to: '/documentos', label: 'Docs', Icon: DocIcon, end: false },
  { to: '/economico', label: 'Económico', Icon: EuroIcon, end: false },
]

const adminItem = { to: '/admin', label: 'Admin', Icon: ShieldIcon, end: false }

export default function BottomNav() {
  const { permisos } = useApp()
  const items = tieneAccesoAdmin(permisos) ? [...baseItems, adminItem] : baseItems

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div
        className="mx-auto grid max-w-lg"
        style={{
          gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {items.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-brand-700' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-full max-w-[64px] items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-brand-50' : ''
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                <span className="leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
