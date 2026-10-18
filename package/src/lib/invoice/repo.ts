import { prisma } from '@/lib/db'
import type { ParsedInvoice } from './types'

export type StoredInvoice = Omit<ParsedInvoice, 'rawText'> & { id: string; createdAt: string }

export async function getInvoice(id: string): Promise<StoredInvoice | null> {
  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { items: { orderBy: { position: 'asc' } } },
  })
  if (!inv) return null
  const { rawText: _raw, items, createdAt, ...rest } = inv
  return {
    ...rest,
    createdAt: createdAt.toISOString(),
    subtotalGravado: rest.subtotalGravado.toNumber(),
    subtotalExento: rest.subtotalExento.toNumber(),
    totalItbis: rest.totalItbis.toNumber(),
    propinaLegal: rest.propinaLegal.toNumber(),
    montoTotal: rest.montoTotal.toNumber(),
    items: items.map((it) => ({
      cantidad: it.cantidad.toNumber(),
      descripcion: it.descripcion,
      unidad: it.unidad,
      precio: it.precio.toNumber(),
      itbis: it.itbis.toNumber(),
      descuento: it.descuento.toNumber(),
      recargo: it.recargo.toNumber(),
      valor: it.valor.toNumber(),
    })),
  }
}

export async function saveInvoice(p: ParsedInvoice) {
  const { items, ...data } = p
  return prisma.invoice.create({
    data: {
      ...data,
      items: { create: items.map((it, position) => ({ ...it, position })) },
    },
    select: { id: true },
  })
}
