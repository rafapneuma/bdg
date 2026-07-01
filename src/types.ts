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
  concepto?: string // agrupa presupuestos de una misma comparativa
}

export interface Vivienda {
  id: string
  referencia: string
  propietario: string
  cuotaMensual: number
  recibosPendientes: number // nº de recibos impagados
}

export type TipoMovimiento = 'ingreso' | 'gasto'
export type Cuenta = 'corriente' | 'fondo'

export interface Movimiento {
  id: string
  fecha: string // ISO
  concepto: string
  tipo: TipoMovimiento
  cuenta: Cuenta
  importe: number
  auto?: boolean // generado automáticamente (cobro de cuota / pago de partida)
}

export interface Partida {
  id: string
  concepto: string
  importe: number
  pagada: boolean
  documentoId?: string // presupuesto adjuntado (documento tipo Presupuesto)
}
