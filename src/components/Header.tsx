import { useState } from 'react'

export default function Header() {
  const [ampliado, setAmpliado] = useState(false)
  const logoSvg = `${import.meta.env.BASE_URL}logo.svg`
  const logoPng = `${import.meta.env.BASE_URL}logo.png`

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
          <div className="leading-tight">
            <p className="text-base font-bold text-brand-800">Balcón del Golf</p>
            <p className="text-xs text-slate-500">Riviera del Sol · Mijas</p>
          </div>
        </div>
      </header>

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
    </>
  )
}
