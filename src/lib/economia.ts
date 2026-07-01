import type { Vivienda, Movimiento, Partida } from '../types'
import { SALDO_INICIAL } from '../data/mockData'

// Deuda de una vivienda = recibos pendientes × cuota mensual
export function deudaVivienda(v: Vivienda): number {
  return v.recibosPendientes * v.cuotaMensual
}

export function estaAlCorriente(v: Vivienda): boolean {
  return v.recibosPendientes <= 0
}

// Saldo de una cuenta = saldo inicial + ingresos − gastos de esa cuenta
export function saldoCuenta(
  movimientos: Movimiento[],
  cuenta: 'corriente' | 'fondo',
): number {
  const inicial = SALDO_INICIAL[cuenta]
  return movimientos
    .filter((m) => m.cuenta === cuenta)
    .reduce((acc, m) => acc + (m.tipo === 'ingreso' ? m.importe : -m.importe), inicial)
}

export interface ResumenEconomico {
  saldoActual: number
  fondoReserva: number
  ingresosCobrados: number
  gastosPagados: number
  deudaTotal: number
  viviendasConDeuda: number
  totalViviendas: number
  morosidad: number // %
  ingresosPrevistosAnuales: number // cuotas × 12
  gastosPrevistos: number // suma de partidas aprobadas
}

export function calcularResumen(
  viviendas: Vivienda[],
  movimientos: Movimiento[],
  partidas: Partida[],
): ResumenEconomico {
  const ingresosCobrados = movimientos
    .filter((m) => m.tipo === 'ingreso' && m.cuenta === 'corriente')
    .reduce((a, m) => a + m.importe, 0)
  const gastosPagados = movimientos
    .filter((m) => m.tipo === 'gasto' && m.cuenta === 'corriente')
    .reduce((a, m) => a + m.importe, 0)

  const deudaTotal = viviendas.reduce((a, v) => a + deudaVivienda(v), 0)
  const viviendasConDeuda = viviendas.filter((v) => !estaAlCorriente(v)).length
  const totalViviendas = viviendas.length
  const morosidad =
    totalViviendas > 0 ? (viviendasConDeuda / totalViviendas) * 100 : 0

  const ingresosPrevistosAnuales = viviendas.reduce(
    (a, v) => a + v.cuotaMensual * 12,
    0,
  )
  const gastosPrevistos = partidas.reduce((a, p) => a + p.importe, 0)

  return {
    saldoActual: saldoCuenta(movimientos, 'corriente'),
    fondoReserva: saldoCuenta(movimientos, 'fondo'),
    ingresosCobrados,
    gastosPagados,
    deudaTotal,
    viviendasConDeuda,
    totalViviendas,
    morosidad,
    ingresosPrevistosAnuales,
    gastosPrevistos,
  }
}
