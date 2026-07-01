export type EstadoIncidencia = 'Abierta' | 'En curso' | 'Resuelta'

export interface Incidencia {
  id: string
  titulo: string
  descripcion: string
  estado: EstadoIncidencia
  categoria: string
  ubicacion: string
  fecha: string // ISO
  autor: string
  fotoUrl?: string // dataURL de la foto opcional
}

export interface OpcionSondeo {
  id: string
  texto: string
  votos: number
}

export interface Sondeo {
  id: string
  titulo: string
  descripcion: string
  estado: 'activo' | 'cerrado'
  cierra: string // fecha texto
  opciones: OpcionSondeo[]
}

export interface Aviso {
  id: string
  titulo: string
  contenido: string
  fecha: string // ISO
  categoria: string
  destacado?: boolean
}

export interface Documento {
  id: string
  titulo: string
  tipo: 'Acta' | 'Presupuesto' | 'Factura' | 'Circular' | 'Contrato'
  fecha: string // ISO
  paginas: number
  tamano: string
}
