'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatMoney } from '@/lib/invoice/format'
import type { ParsedInvoice } from '@/lib/invoice/types'

type ParseResult = { invoice: ParsedInvoice; mismatch: number; existingId: string | null }

export default function NuevaFacturaPage() {
  const router = useRouter()
  const [result, setResult] = useState<ParseResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    const body = new FormData()
    body.append('file', file)
    const res = await fetch('/api/admin/facturas/parse', { method: 'POST', body })
    const json = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) setError(json.error ?? 'No se pudo leer el PDF')
    else setResult(json)
  }

  const save = async () => {
    if (!result) return
    setLoading(true)
    const res = await fetch('/api/admin/facturas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: result.invoice.rawText }),
    })
    const json = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) setError(json.error ?? 'No se pudo guardar')
    else router.push(`/admin/facturas/${json.id}`)
  }

  const inv = result?.invoice
  return (
    <div className='mx-auto max-w-xl'>
      <h1 className='mb-4 text-2xl! font-bold'>Subir factura (PDF)</h1>
      <label className='flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 text-center hover:border-primary'>
        <span className='font-semibold'>{loading ? 'Procesando…' : 'Toca para elegir el PDF de la factura'}</span>
        <span className='text-sm text-gray-500'>El PDF que te envía tu proveedor de facturación electrónica</span>
        <input type='file' accept='application/pdf' className='hidden' onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {error && <p className='mt-4 rounded-lg bg-red-50 p-3 text-red-700'>{error}</p>}

      {inv && result && (
        <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>
          <dl className='grid grid-cols-2 gap-x-4 gap-y-1 text-sm'>
            <dt className='text-gray-500'>e-NCF</dt><dd className='font-mono font-semibold'>{inv.encf}</dd>
            <dt className='text-gray-500'>Fecha</dt><dd>{inv.fechaEmision}</dd>
            <dt className='text-gray-500'>Cliente</dt><dd>{inv.clienteRazonSocial ?? 'N/A'}</dd>
            <dt className='text-gray-500'>Artículos</dt>
            <dd>{inv.items.map((it) => `${it.cantidad} × ${it.descripcion}`).join(', ') || '—'}</dd>
            <dt className='text-gray-500'>ITBIS</dt><dd className='tabular-nums'>{formatMoney(inv.totalItbis)}</dd>
            <dt className='text-gray-500'>Propina legal</dt><dd className='tabular-nums'>{formatMoney(inv.propinaLegal)}</dd>
            <dt className='text-gray-500'>Total RD$</dt><dd className='text-lg font-bold tabular-nums'>{formatMoney(inv.montoTotal)}</dd>
          </dl>
          {inv.items.length === 0 && (
            <p className='mt-3 rounded-lg bg-yellow-50 p-2 text-sm text-yellow-800'>No se pudieron leer los artículos de la tabla.</p>
          )}
          {result.mismatch !== 0 && (
            <p className='mt-3 rounded-lg bg-yellow-50 p-2 text-sm text-yellow-800'>
              Ojo: subtotal + ITBIS + propina no cuadra con el total (diferencia {formatMoney(result.mismatch)}).
            </p>
          )}
          {result.existingId ? (
            <p className='mt-4 text-sm'>
              Esta factura ya está guardada.{' '}
              <Link href={`/admin/facturas/${result.existingId}`} className='font-semibold text-primary underline'>Ver e imprimir</Link>
            </p>
          ) : (
            <button
              onClick={save}
              disabled={loading}
              className='mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50'>
              Guardar e imprimir
            </button>
          )}
        </div>
      )}
    </div>
  )
}
