export type Rol = 'admin' | 'presidente' | 'vicepresidente' | 'vecino'

export interface Permisos {
  editarEconomico: boolean
  gestionarDocumentos: boolean
  crearAvisos: boolean
  gestionarSondeos: boolean
  gestionarIncidencias: boolean
}

export interface InfoRol {
  nombre: string
  descripcion: string
  color: string // clases Tailwind para el distintivo
  permisos: Permisos
}

export const ROLES: Record<Rol, InfoRol> = {
  admin: {
    nombre: 'Administrador',
    descripcion: 'Gestor de la finca',
    color: 'bg-brand-700 text-white',
    permisos: {
      editarEconomico: true,
      gestionarDocumentos: true,
      crearAvisos: true,
      gestionarSondeos: true,
      gestionarIncidencias: true,
    },
  },
  presidente: {
    nombre: 'Presidente',
    descripcion: 'Presidente de la comunidad',
    color: 'bg-terra-600 text-white',
    permisos: {
      editarEconomico: false,
      gestionarDocumentos: true,
      crearAvisos: true,
      gestionarSondeos: true,
      gestionarIncidencias: true,
    },
  },
  vicepresidente: {
    nombre: 'Vicepresidente',
    descripcion: 'Apoyo al presidente',
    color: 'bg-amber-500 text-white',
    permisos: {
      editarEconomico: false,
      gestionarDocumentos: false,
      crearAvisos: true,
      gestionarSondeos: true,
      gestionarIncidencias: true,
    },
  },
  vecino: {
    nombre: 'Vecino/a',
    descripcion: 'Propietario/a',
    color: 'bg-slate-200 text-slate-700',
    permisos: {
      editarEconomico: false,
      gestionarDocumentos: false,
      crearAvisos: false,
      gestionarSondeos: false,
      gestionarIncidencias: false,
    },
  },
}

export const ORDEN_ROLES: Rol[] = ['admin', 'presidente', 'vicepresidente', 'vecino']

// ¿Este rol tiene acceso a la pestaña Administración?
export function tieneAccesoAdmin(p: Permisos): boolean {
  return (
    p.editarEconomico ||
    p.gestionarDocumentos ||
    p.crearAvisos ||
    p.gestionarSondeos ||
    p.gestionarIncidencias
  )
}
