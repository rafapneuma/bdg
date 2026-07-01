import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { ROLES, ORDEN_ROLES } from '../roles'
import { CheckIcon } from './icons'

export default function Header() {
  const { rol, setRol } = useApp()
  const [ampliado, setAmpliado] = useState(false)
  const [selectorRol, setSelectorRol] = useState(false)
  const logoSvg = `${import.meta.env.BASE_URL}logo.svg`
  const logoPng = `${import.meta.env.BASE_URL}logo.png`
  const info = ROLES[rol]

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            onClick={() => setAmpliado(true)}
            aria-label="Ver el logo en grande"
            className="shrink-0"
          >
            <img
              src={logoSvg}
              alt="Logo Balcón del Golf"
              className="h-10 w-10 object-contain"
            />
          </button>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-base font-bold text-brand-800">Balcón del Golf</p>
            <p className="text-xs text-slate-500">Riviera del Sol · Mijas</p>
          </div>

          {/* Selector de rol (demo) */}
          <button
            onClick={() => setSelectorRol(true)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${info.color}`}
          >
            {info.nombre}
          </button>
        </div>
      </header>

      {/* Modal: logo en grande */}
      {ampliado && (
        <div
          onClick={() => setAmpliado(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 p-6 backdrop-blur"
        >
          <img
            src={logoPng}
            alt="Logo Balcón del Golf en grande"
            className="max-h-[80vh] w-full max-w-md object-contain"
          />
          <button
            onClick={() => setAmpliado(false)}
            className="mt-4 rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Modal: selector de rol */}
      {selectorRol && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div
            className="w-full max-w-lg rounded-t-3xl bg-white p-5 sm:rounded-3xl"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-800">Cambiar de rol</h2>
              <button
                onClick={() => setSelectorRol(false)}
                className="rounded-full px-3 py-1 text-sm font-medium text-slate-400"
              >
                Cerrar
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Demo: elige un rol para ver qué puede hacer cada cargo. En la versión
              oficial esto vendría de tu inicio de sesión.
            </p>

            <div className="space-y-2">
              {ORDEN_ROLES.map((r) => {
                const ri = ROLES[r]
                const activo = r === rol
                return (
                  <button
                    key={r}
                    onClick={() => {
                      setRol(r)
                      setSelectorRol(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
                      activo
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 active:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${ri.color}`}
                    >
                      {ri.nombre.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-slate-800">
                        {ri.nombre}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {ri.descripcion}
                      </span>
                    </span>
                    {activo && <CheckIcon className="h-5 w-5 shrink-0 text-brand-600" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
