import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Incidencia, Sondeo } from '../types'
import {
  incidenciasIniciales,
  sondeosIniciales,
} from '../data/mockData'

interface NuevaIncidenciaInput {
  titulo: string
  descripcion: string
  categoria: string
  ubicacion: string
  fotoUrl?: string
}

interface AppContextValue {
  incidencias: Incidencia[]
  addIncidencia: (input: NuevaIncidenciaInput) => void
  sondeos: Sondeo[]
  votar: (sondeoId: string, opcionId: string) => void
  yaVotado: Record<string, string> // sondeoId -> opcionId elegida
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasIniciales)
  const [sondeos, setSondeos] = useState<Sondeo[]>(sondeosIniciales)
  const [yaVotado, setYaVotado] = useState<Record<string, string>>({})

  const addIncidencia = (input: NuevaIncidenciaInput) => {
    const nueva: Incidencia = {
      id: `inc-${Date.now()}`,
      titulo: input.titulo,
      descripcion: input.descripcion,
      categoria: input.categoria || 'General',
      ubicacion: input.ubicacion || 'Sin especificar',
      estado: 'Abierta',
      fecha: new Date().toISOString(),
      autor: 'Tú (demo)',
      fotoUrl: input.fotoUrl,
    }
    setIncidencias((prev) => [nueva, ...prev])
  }

  const votar = (sondeoId: string, opcionId: string) => {
    // Solo se puede votar una vez por sondeo (durante la sesión)
    if (yaVotado[sondeoId]) return
    setSondeos((prev) =>
      prev.map((s) =>
        s.id === sondeoId
          ? {
              ...s,
              opciones: s.opciones.map((o) =>
                o.id === opcionId ? { ...o, votos: o.votos + 1 } : o,
              ),
            }
          : s,
      ),
    )
    setYaVotado((prev) => ({ ...prev, [sondeoId]: opcionId }))
  }

  return (
    <AppContext.Provider value={{ incidencias, addIncidencia, sondeos, votar, yaVotado }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
