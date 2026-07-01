export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
        <img
          src={`${import.meta.env.BASE_URL}logo.svg`}
          alt="Logo Balcón del Golf"
          className="h-10 w-10 shrink-0 object-contain"
        />
        <div className="leading-tight">
          <p className="text-base font-bold text-brand-800">Balcón del Golf</p>
          <p className="text-xs text-slate-500">Riviera del Sol · Mijas</p>
        </div>
      </div>
    </header>
  )
}
