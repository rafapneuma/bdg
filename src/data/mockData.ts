import type { Incidencia, Sondeo, Aviso, Documento } from '../types'

// ─────────────────────────────────────────────────────────────
// DATOS INVENTADOS — solo para la demo. No representan datos reales.
// ─────────────────────────────────────────────────────────────

export const incidenciasIniciales: Incidencia[] = [
  {
    id: 'inc-1',
    titulo: 'Farola fundida en el paseo central',
    descripcion:
      'La farola junto al bloque 4 lleva tres noches apagada. La zona queda muy oscura al llegar a los buzones.',
    estado: 'Abierta',
    categoria: 'Iluminación',
    ubicacion: 'Paseo central, bloque 4',
    fecha: '2026-06-28T21:15:00',
    autor: 'Vecino/a bloque 4',
  },
  {
    id: 'inc-2',
    titulo: 'Fuga de agua junto a la piscina',
    descripcion:
      'Sale agua de forma continua cerca de la depuradora de la piscina. Parece relacionado con las fugas que se están reparando.',
    estado: 'En curso',
    categoria: 'Fontanería',
    ubicacion: 'Zona piscina comunitaria',
    fecha: '2026-06-25T10:40:00',
    autor: 'Conserjería',
  },
  {
    id: 'inc-3',
    titulo: 'Puerta del garaje se queda abierta',
    descripcion:
      'El mando abre la puerta del garaje pero a veces no cierra del todo y se queda a medias durante la noche.',
    estado: 'En curso',
    categoria: 'Accesos',
    ubicacion: 'Garaje sótano -1',
    fecha: '2026-06-22T08:05:00',
    autor: 'Vecino/a bloque 2',
  },
  {
    id: 'inc-4',
    titulo: 'Contenedores desbordados el fin de semana',
    descripcion:
      'Los contenedores de la entrada se llenan el sábado y quedan bolsas fuera hasta el lunes.',
    estado: 'Resuelta',
    categoria: 'Limpieza',
    ubicacion: 'Entrada principal',
    fecha: '2026-06-10T18:30:00',
    autor: 'Vecino/a bloque 1',
  },
  {
    id: 'inc-5',
    titulo: 'Baldosa suelta en las escaleras del bloque 3',
    descripcion:
      'Una baldosa del primer tramo de escaleras está suelta y baila al pisarla. Puede ser peligrosa.',
    estado: 'Abierta',
    categoria: 'Mantenimiento',
    ubicacion: 'Bloque 3, portal',
    fecha: '2026-06-29T13:20:00',
    autor: 'Vecino/a bloque 3',
  },
]

export const sondeosIniciales: Sondeo[] = [
  {
    id: 'son-1',
    titulo: '¿Qué franja horaria prefieres para la piscina?',
    descripcion:
      'Queremos ajustar el horario de apertura de la piscina comunitaria para esta temporada. Elige tu franja preferida.',
    estado: 'activo',
    cierra: '15 de julio de 2026',
    opciones: [
      { id: 'o1', texto: 'Mañanas (09:00 – 14:00)', votos: 38 },
      { id: 'o2', texto: 'Tardes (16:00 – 21:00)', votos: 52 },
      { id: 'o3', texto: 'Horario partido (mañana y tarde)', votos: 61 },
      { id: 'o4', texto: 'Horario continuo (09:00 – 21:00)', votos: 44 },
    ],
  },
  {
    id: 'son-2',
    titulo: '¿Instalamos placas solares en las zonas comunes?',
    descripcion:
      'Consulta previa a la junta sobre estudiar un presupuesto de autoconsumo para reducir la factura eléctrica común.',
    estado: 'cerrado',
    cierra: 'Cerrado el 30 de mayo de 2026',
    opciones: [
      { id: 'o1', texto: 'Sí, pedir presupuesto', votos: 118 },
      { id: 'o2', texto: 'No por ahora', votos: 29 },
      { id: 'o3', texto: 'Necesito más información', votos: 41 },
    ],
  },
  {
    id: 'son-3',
    titulo: 'Día para la fiesta de vecinos de verano',
    descripcion: 'Elegimos la fecha de la comida de convivencia anual de la urbanización.',
    estado: 'cerrado',
    cierra: 'Cerrado el 12 de junio de 2026',
    opciones: [
      { id: 'o1', texto: 'Sábado 19 de julio', votos: 74 },
      { id: 'o2', texto: 'Sábado 26 de julio', votos: 96 },
      { id: 'o3', texto: 'Sábado 2 de agosto', votos: 33 },
    ],
  },
]

export const avisosIniciales: Aviso[] = [
  {
    id: 'av-1',
    titulo: 'Reparación de fugas de agua',
    contenido:
      'Estimados vecinos:\n\nOs informamos de que se están localizando y reparando varias fugas de agua detectadas en distintos puntos de la urbanización. Los trabajos comenzaron esta semana y se prolongarán durante los próximos días.\n\nDurante las intervenciones podrán producirse cortes puntuales de agua en algunas zonas comunes, así como pequeñas molestias por la presencia de operarios y maquinaria. Se está actuando con la mayor rapidez posible para minimizar el impacto y evitar pérdidas de agua.\n\nAgradecemos de antemano vuestra comprensión y paciencia mientras se resuelven estas incidencias.\n\nLa Administración',
    fecha: '2026-06-29T09:00:00',
    categoria: 'Urgente',
    destacado: true,
  },
  {
    id: 'av-2',
    titulo: 'Mantenimiento y poda de jardines',
    contenido:
      'El servicio de jardinería realizará la poda y el desbroce de las zonas ajardinadas comunes la próxima semana. Los trabajos se harán en horario de mañana. Rogamos no dejar objetos ni vehículos en las zonas señalizadas esos días.',
    fecha: '2026-06-24T11:30:00',
    categoria: 'Mantenimiento',
  },
  {
    id: 'av-3',
    titulo: 'Convocatoria de Junta General Ordinaria',
    contenido:
      'Se convoca a todos los propietarios a la Junta General Ordinaria que se celebrará el próximo 18 de julio a las 19:00 en la zona social. En breve recibiréis el orden del día y la documentación. Se ruega la máxima asistencia o, en su defecto, delegación del voto.',
    fecha: '2026-06-20T17:00:00',
    categoria: 'Junta',
  },
  {
    id: 'av-4',
    titulo: 'Nuevo horario de conserjería en verano',
    contenido:
      'Durante los meses de julio y agosto, la conserjería atenderá en horario de 08:00 a 15:00 de lunes a viernes. Para urgencias fuera de ese horario podéis usar el teléfono de emergencias indicado en el tablón.',
    fecha: '2026-06-15T10:00:00',
    categoria: 'Información',
  },
]

export const documentosIniciales: Documento[] = [
  {
    id: 'doc-1',
    titulo: 'Acta Junta General Ordinaria 2025',
    tipo: 'Acta',
    fecha: '2025-07-19T00:00:00',
    paginas: 8,
    tamano: '420 KB',
  },
  {
    id: 'doc-2',
    titulo: 'Presupuesto anual 2026',
    tipo: 'Presupuesto',
    fecha: '2026-01-15T00:00:00',
    paginas: 4,
    tamano: '210 KB',
  },
  {
    id: 'doc-3',
    titulo: 'Presupuesto reparación de fugas de agua',
    tipo: 'Presupuesto',
    fecha: '2026-06-18T00:00:00',
    paginas: 3,
    tamano: '185 KB',
  },
  {
    id: 'doc-4',
    titulo: 'Factura mantenimiento piscina — 2º trimestre',
    tipo: 'Factura',
    fecha: '2026-06-30T00:00:00',
    paginas: 1,
    tamano: '95 KB',
  },
  {
    id: 'doc-5',
    titulo: 'Circular normas de uso de la piscina',
    tipo: 'Circular',
    fecha: '2026-05-28T00:00:00',
    paginas: 2,
    tamano: '130 KB',
  },
  {
    id: 'doc-6',
    titulo: 'Contrato empresa de jardinería 2026',
    tipo: 'Contrato',
    fecha: '2026-02-10T00:00:00',
    paginas: 6,
    tamano: '310 KB',
  },
]

// Datos económicos inventados (solo lectura)
export const datosEconomicos = {
  saldoActual: 42350,
  fondoReserva: 18600,
  previsionIngresos: 96000,
  gastosPrevistos: 88400,
  presupuestoAnual: 92000,
  cuotaMensual: 38,
  viviendas: 200,
  morosidad: 3.5, // % de recibos pendientes
  ultimaActualizacion: '30 de junio de 2026',
  presupuestosAprobados: [
    { concepto: 'Reparación de fugas de agua', importe: 7800, estado: 'Aprobado' },
    { concepto: 'Mantenimiento anual de piscina', importe: 6200, estado: 'Aprobado' },
    { concepto: 'Jardinería y zonas verdes', importe: 11400, estado: 'Aprobado' },
    { concepto: 'Limpieza de zonas comunes', importe: 15800, estado: 'Aprobado' },
    { concepto: 'Seguro comunitario', importe: 4900, estado: 'Aprobado' },
  ],
  gastosPorCategoria: [
    { categoria: 'Limpieza', importe: 15800 },
    { categoria: 'Jardinería', importe: 11400 },
    { categoria: 'Electricidad zonas comunes', importe: 9600 },
    { categoria: 'Agua', importe: 8200 },
    { categoria: 'Mantenimiento piscina', importe: 6200 },
    { categoria: 'Ascensores', importe: 7100 },
    { categoria: 'Seguros', importe: 4900 },
    { categoria: 'Administración', importe: 5400 },
  ],
  tuVivienda: {
    referencia: 'Bloque 3 · 2º B',
    estado: 'al_corriente' as 'al_corriente' | 'pendiente',
    importePendiente: 0,
    cuotaMensual: 38,
    proximoRecibo: '05 de julio de 2026',
  },
}
