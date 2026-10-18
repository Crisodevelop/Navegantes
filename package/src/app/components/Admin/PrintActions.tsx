'use client'

import { useState } from 'react'
import { buildTicket, imageBitmap, rawbtIntentUrl, toCanvas, toEscPos, type Bitmap } from '@/lib/escpos'
import type { StoredInvoice } from '@/lib/invoice/repo'

async function loadLogo(): Promise<Bitmap | null> {
  try {
    return await imageBitmap('/images/Logo/tripulantes-ticket.png')
  } catch {
    return null
  }
}

export default function PrintActions({ invoice }: { invoice: StoredInvoice }) {
  const [busy, setBusy] = useState(false)

  const printRawBT = async () => {
    setBusy(true)
    try {
      const bytes = toEscPos(buildTicket(invoice, await loadLogo()))
      window.location.href = rawbtIntentUrl(bytes)
    } finally {
      setBusy(false)
    }
  }

  const downloadPng = async () => {
    setBusy(true)
    try {
      const canvas = toCanvas(buildTicket(invoice, await loadLogo()))
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) return
      const file = new File([blob], `ticket-${invoice.encf}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: invoice.encf }).catch(() => {})
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = file.name
        a.click()
        URL.revokeObjectURL(a.href)
      }
    } finally {
      setBusy(false)
    }
  }

  const btn = 'w-full rounded-lg px-4 py-3 text-base font-semibold disabled:opacity-50'
  return (
    <div className='no-print mx-auto mb-6 flex max-w-sm flex-col gap-2'>
      <button onClick={printRawBT} disabled={busy} className={`${btn} bg-primary text-white`}>
        Imprimir con RawBT (Android)
      </button>
      <button onClick={() => window.print()} disabled={busy} className={`${btn} bg-black text-white`}>
        Imprimir desde el navegador (USB)
      </button>
      <button onClick={downloadPng} disabled={busy} className={`${btn} border border-gray-300 bg-white`}>
        Compartir / descargar imagen del ticket
      </button>
    </div>
  )
}
