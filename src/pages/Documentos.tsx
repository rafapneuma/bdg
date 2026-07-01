import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { PageHeader, Card } from '../components/ui'
import { DocIcon, ArrowLeft } from '../components/icons'
import { formatearFecha } from '../lib/format'
import type { Documento } from '../types'

const tipoColor: Record<Documento['tipo'], string> = {
  Acta: 'bg-brand-50 text-brand-700',
  Presupuesto: 'bg-emerald-50 text-emerald-600',
  Factura: 'bg-amber-50 text-amber-700',
  Circular: 'bg-purple-50 text-purple-600',
  Contrato: 'bg-slate-100 text-slate-600',
}

export default function Documentos() {
  const { documentos } = useApp()
  const [doc, setDoc] = useState<Documento | null>(null)

  return (
    <div>
      <PageHeader titulo="Documentos" subtitulo="Actas, presupuestos y facturas" />

      <div className="space-y-3">
        {documentos.map((d) => (
          <button key={d.id} onClick={() => setDoc(d)} className="block w-full text-left">
            <Card className="transition-shadow active:shadow-md">
              <div className="flex items-center gap-3">
                <span className={`shrink-0 rounded-xl p-3 ${tipoColor[d.tipo]}`}>
                  <DocIcon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">{d.titulo}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {d.tipo} · {formatearFecha(d.fecha)}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-slate-400">
                  PDF · {d.tamano}
                </span>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {doc && <VisorDocumento doc={doc} onClose={() => setDoc(null)} />}
    </div>
  )
}

function VisorDocumento({ doc, onClose }: { doc: Documento; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-800">
      <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 text-white">
        <button onClick={onClose} className="flex items-center gap-1 text-sm font-medium">
          <ArrowLeft />
          Cerrar
        </button>
        <p className="truncate text-sm font-medium">{doc.titulo}</p>
      </div>

      {/* Placeholder de páginas de PDF */}
      <div className="flex-1 overflow-y-auto p-4">
        {Array.from({ length: doc.paginas }).map((_, i) => (
          <div
            key={i}
            className="mx-auto mb-4 aspect-[1/1.414] w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <DocIcon className="h-8 w-8 text-brand-700" />
              <div>
                <p className="text-sm font-bold text-brand-800">{doc.titulo}</p>
                <p className="text-xs text-slate-400">
                  Página {i + 1} de {doc.paginas}
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-2.5">
              {Array.from({ length: 12 }).map((_, j) => (
                <div
                  key={j}
                  className="h-2.5 rounded bg-slate-100"
                  style={{ width: `${65 + ((i * 7 + j * 13) % 35)}%` }}
                />
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-slate-300">
              Documento de ejemplo — sin contenido real (demo)
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
