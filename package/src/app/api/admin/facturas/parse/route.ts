import { NextResponse } from 'next/server'
import { parseInvoicePdf, totalMismatch } from '@/lib/invoice/parse'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

const MAX_BYTES = 5 * 1024 * 1024

// Lee el PDF y devuelve los datos extraídos para revisarlos antes de guardar
export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Selecciona un archivo PDF' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'El PDF es muy grande (máx. 5 MB)' }, { status: 400 })
  }
  try {
    const invoice = await parseInvoicePdf(new Uint8Array(await file.arrayBuffer()))
    const existing = await prisma.invoice.findUnique({ where: { encf: invoice.encf }, select: { id: true } })
    return NextResponse.json({ invoice, mismatch: totalMismatch(invoice), existingId: existing?.id ?? null })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'No se pudo leer el PDF'
    return NextResponse.json({ error: message }, { status: 422 })
  }
}
