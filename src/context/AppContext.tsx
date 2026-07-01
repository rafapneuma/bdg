import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  Incidencia,
  EstadoIncidencia,
  Sondeo,
  Aviso,
  Documento,
  Vivienda,
  Movimiento,
  Partida,
} from '../types'
import {
  incidenciasIniciales,
  sondeosIniciales,
  avisosIniciales,
  documentosIniciales,
  viviendasIniciales,
  movimientosIniciales,
  partidasIniciales,
} from '../data/mockData'
import { deudaVivienda } from '../lib/economia'
import { ROLES, type Rol, type Permisos } from '../roles'

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
  concepto?: string
}

interface NuevoSondeoInput {
  titulo: string
  descripcion: string
  opciones: string[]
}

interface NuevoMovimientoInput {
  concepto: string
  tipo: Movimiento['tipo']
  cuenta: Movimiento['cuenta']
  importe: number
}

interface NuevaPartidaInput {
  concepto: string
  importe: number
  documentoId?: string
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
  viviendas: Vivienda[]
  movimientos: Movimiento[]
  partidas: Partida[]
  addMovimiento: (input: NuevoMovimientoInput) => void
  editarCuotaVivienda: (id: string, cuota: number) => void
  addReciboPendiente: (id: string) => void
  registrarPagoVivienda: (id: string) => void
  addPartida: (input: NuevaPartidaInput) => void
  registrarPagoPartida: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>('vecino')
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasIniciales)
  const [sondeos, setSondeos] = useState<Sondeo[]>(sondeosIniciales)
  const [yaVotado, setYaVotado] = useState<Record<string, string>>({})
  const [avisos, setAvisos] = useState<Aviso[]>(avisosIniciales)
  const [documentos, setDocumentos] = useState<Documento[]>(documentosIniciales)
  const [viviendas, setViviendas] = useState<Vivienda[]>(viviendasIniciales)
  const [movimientos, setMovimientos] = useState<Movimiento[]>(movimientosIniciales)
  const [partidas, setPartidas] = useState<Partida[]>(partidasIniciales)

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
    setIncidencias((prev) => prev.map((i) => (i.id === id ? { ...i, estado } : i)))
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
        s.id === id
          ? { ...s, estado: 'cerrado', cierra: 'Cerrado por la administración' }
          : s,
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
      concepto: input.concepto?.trim() || undefined,
    }
    setDocumentos((prev) => [nuevo, ...prev])
  }

  // ── Económico ────────────────────────────────────────────────
  const addMovimiento = (input: NuevoMovimientoInput) => {
    const nuevo: Movimiento = {
      id: `mov-${Date.now()}`,
      fecha: new Date().toISOString(),
      concepto: input.concepto,
      tipo: input.tipo,
      cuenta: input.cuenta,
      importe: Math.abs(input.importe) || 0,
    }
    setMovimientos((prev) => [nuevo, ...prev])
  }

  const editarCuotaVivienda = (id: string, cuota: number) => {
    setViviendas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, cuotaMensual: Math.max(0, cuota) } : v)),
    )
  }

  const addReciboPendiente = (id: string) => {
    setViviendas((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, recibosPendientes: v.recibosPendientes + 1 } : v,
      ),
    )
  }

  // Cobrar toda la deuda de una vivienda: genera un ingreso y pone a 0 los recibos
  const registrarPagoVivienda = (id: string) => {
    const v = viviendas.find((x) => x.id === id)
    if (!v || v.recibosPendientes <= 0) return
    const importe = deudaVivienda(v)
    setMovimientos((prev) => [
      {
        id: `mov-${Date.now()}`,
        fecha: new Date().toISOString(),
        concepto: `Cobro recibos — ${v.referencia}`,
        tipo: 'ingreso',
        cuenta: 'corriente',
        importe,
        auto: true,
      },
      ...prev,
    ])
    setViviendas((prev) =>
      prev.map((x) => (x.id === id ? { ...x, recibosPendientes: 0 } : x)),
    )
  }

  const addPartida = (input: NuevaPartidaInput) => {
    const nueva: Partida = {
      id: `par-${Date.now()}`,
      concepto: input.concepto,
      importe: Math.abs(input.importe) || 0,
      pagada: false,
      documentoId: input.documentoId,
    }
    setPartidas((prev) => [nueva, ...prev])
  }

  // Pagar una partida: la marca como pagada y genera un gasto en la cuenta corriente
  const registrarPagoPartida = (id: string) => {
    const p = partidas.find((x) => x.id === id)
    if (!p || p.pagada) return
    setMovimientos((prev) => [
      {
        id: `mov-${Date.now()}`,
        fecha: new Date().toISOString(),
        concepto: `Pago — ${p.concepto}`,
        tipo: 'gasto',
        cuenta: 'corriente',
        importe: p.importe,
        auto: true,
      },
      ...prev,
    ])
    setPartidas((prev) => prev.map((x) => (x.id === id ? { ...x, pagada: true } : x)))
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
        viviendas,
        movimientos,
        partidas,
        addMovimiento,
        editarCuotaVivienda,
        addReciboPendiente,
        registrarPagoVivienda,
        addPartida,
        registrarPagoPartida,
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
