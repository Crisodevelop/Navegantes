import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { parseInvoiceText } from '@/lib/invoice/parse'
import { saveInvoice } from '@/lib/invoice/repo'

export const runtime = 'nodejs'

// Guarda una factura. Se vuelve a interpretar el texto original en el servidor
// para no confiar en los datos que manda el navegador.
export async function POST(req: Request) {
  const { rawText } = (await req.json().catch(() => ({}))) as { rawText?: string }
  if (!rawText) return NextResponse.json({ error: 'Faltan datos de la factura' }, { status: 400 })
  try {
    const { id } = await saveInvoice(parseInvoiceText(rawText))
    return NextResponse.json({ id })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return NextResponse.json({ error: 'Esta factura (e-NCF) ya está guardada' }, { status: 409 })
    }
    const message = e instanceof Error ? e.message : 'No se pudo guardar'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
