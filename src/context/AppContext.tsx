import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  Incidencia,
  EstadoIncidencia,
  Sondeo,
  Aviso,
  Documento,
} from '../types'
import {
  incidenciasIniciales,
  sondeosIniciales,
  avisosIniciales,
  documentosIniciales,
  datosEconomicos,
} from '../data/mockData'
import { ROLES, type Rol, type Permisos } from '../roles'

export type DatosEconomicos = typeof datosEconomicos

interface NuevaIncidenciaInput {
  titulo: string
  descripcion: string
  categoria: string
  ubicacion: string
  fotoUrl?: string
}

interface NuevoAvisoInput {
  titulo: string
  contenido: string
  categoria: string
  destacado?: boolean
}

interface NuevoDocumentoInput {
  titulo: string
  tipo: Documento['tipo']
}

interface NuevoSondeoInput {
  titulo: string
  descripcion: string
  opciones: string[]
}

interface AppContextValue {
  // Rol / permisos
  rol: Rol
  setRol: (rol: Rol) => void
  permisos: Permisos

  // Incidencias
  incidencias: Incidencia[]
  addIncidencia: (input: NuevaIncidenciaInput) => void
  cambiarEstadoIncidencia: (id: string, estado: EstadoIncidencia) => void

  // Sondeos
  sondeos: Sondeo[]
  votar: (sondeoId: string, opcionId: string) => void
  yaVotado: Record<string, string>
  addSondeo: (input: NuevoSondeoInput) => void
  cerrarSondeo: (id: string) => void

  // Avisos
  avisos: Aviso[]
  addAviso: (input: NuevoAvisoInput) => void

  // Documentos
  documentos: Documento[]
  addDocumento: (input: NuevoDocumentoInput) => void

  // Económico
  economico: DatosEconomicos
  updateEconomico: (patch: Partial<DatosEconomicos>) => void
  addPresupuesto: (concepto: string, importe: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>('vecino')
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasIniciales)
  const [sondeos, setSondeos] = useState<Sondeo[]>(sondeosIniciales)
  const [yaVotado, setYaVotado] = useState<Record<string, string>>({})
  const [avisos, setAvisos] = useState<Aviso[]>(avisosIniciales)
  const [documentos, setDocumentos] = useState<Documento[]>(documentosIniciales)
  const [economico, setEconomico] = useState<DatosEconomicos>(datosEconomicos)

  const permisos = ROLES[rol].permisos

  // ── Incidencias ──────────────────────────────────────────────
  const addIncidencia = (input: NuevaIncidenciaInput) => {
    const nueva: Incidencia = {
      id: `inc-${Date.now()}`,
      titulo: input.titulo,
      descripcion: input.descripcion,
      categoria: input.categoria || 'General',
      ubicacion: input.ubicacion || 'Sin especificar',
      estado: 'Abierta',
      fecha: new Date().toISOString(),
      autor: `Tú (${ROLES[rol].nombre})`,
      fotoUrl: input.fotoUrl,
    }
    setIncidencias((prev) => [nueva, ...prev])
  }

  const cambiarEstadoIncidencia = (id: string, estado: EstadoIncidencia) => {
    setIncidencias((prev) =>
      prev.map((i) => (i.id === id ? { ...i, estado } : i)),
    )
  }

  // ── Sondeos ──────────────────────────────────────────────────
  const votar = (sondeoId: string, opcionId: string) => {
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

  const addSondeo = (input: NuevoSondeoInput) => {
    const nuevo: Sondeo = {
      id: `son-${Date.now()}`,
      titulo: input.titulo,
      descripcion: input.descripcion,
      estado: 'activo',
      cierra: 'sin fecha de cierre',
      opciones: input.opciones
        .filter((t) => t.trim())
        .map((texto, i) => ({ id: `o${i + 1}`, texto, votos: 0 })),
    }
    setSondeos((prev) => [nuevo, ...prev])
  }

  const cerrarSondeo = (id: string) => {
    setSondeos((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: 'cerrado', cierra: 'Cerrado por la administración' } : s,
      ),
    )
  }

  // ── Avisos ───────────────────────────────────────────────────
  const addAviso = (input: NuevoAvisoInput) => {
    const nuevo: Aviso = {
      id: `av-${Date.now()}`,
      titulo: input.titulo,
      contenido: input.contenido,
      categoria: input.categoria || 'Información',
      fecha: new Date().toISOString(),
      destacado: input.destacado,
    }
    setAvisos((prev) => [nuevo, ...prev])
  }

  // ── Documentos ───────────────────────────────────────────────
  const addDocumento = (input: NuevoDocumentoInput) => {
    const nuevo: Documento = {
      id: `doc-${Date.now()}`,
      titulo: input.titulo,
      tipo: input.tipo,
      fecha: new Date().toISOString(),
      paginas: 2,
      tamano: '—',
    }
    setDocumentos((prev) => [nuevo, ...prev])
  }

  // ── Económico ────────────────────────────────────────────────
  const updateEconomico = (patch: Partial<DatosEconomicos>) => {
    setEconomico((prev) => ({ ...prev, ...patch }))
  }

  const addPresupuesto = (concepto: string, importe: number) => {
    setEconomico((prev) => ({
      ...prev,
      presupuestosAprobados: [
        { concepto, importe, estado: 'Aprobado' },
        ...prev.presupuestosAprobados,
      ],
    }))
  }

  return (
    <AppContext.Provider
      value={{
        rol,
        setRol,
        permisos,
        incidencias,
        addIncidencia,
        cambiarEstadoIncidencia,
        sondeos,
        votar,
        yaVotado,
        addSondeo,
        cerrarSondeo,
        avisos,
        addAviso,
        documentos,
        addDocumento,
        economico,
        updateEconomico,
        addPresupuesto,
      }}
    >
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
