import { extractText, getDocumentProxy } from 'unpdf'
import { buildDgiiQrUrl } from './qr'
import type { ParsedInvoice, ParsedItem } from './types'

// "3,000.00" -> 3000, "-" o vacío -> 0
export function toNumber(s: string | null | undefined): number {
  if (!s) return 0
  const clean = s.replace(/RD\$/g, '').replace(/,/g, '').trim()
  if (clean === '' || clean === '-') return 0
  const n = Number(clean)
  return Number.isFinite(n) ? n : 0
}

const NA = (v: string | null) => (!v || v === 'N/A' ? null : v)

function field(text: string, label: string): string | null {
  const m = text.match(new RegExp(`${label}:[ \\t]*([^\\n]*)`))
  return m ? m[1].trim() : null
}

const NUM = String.raw`(-|[\d,]+\.\d{2})`
const ITEM_RE = new RegExp(
  String.raw`^([\d,]+\.\d{2})\s+(.+?)\s+(\S+)\s+${NUM}\s+${NUM}\s+${NUM}\s+${NUM}\s+${NUM}$`,
)

function parseItems(lines: string[]): ParsedItem[] {
  const start = lines.findIndex((l) => l.startsWith('Cant '))
  if (start === -1) return []
  const items: ParsedItem[] = []
  for (const line of lines.slice(start + 1)) {
    const m = line.match(ITEM_RE)
    if (!m) {
      if (items.length) break
      continue
    }
    items.push({
      cantidad: toNumber(m[1]),
      descripcion: m[2],
      unidad: m[3],
      precio: toNumber(m[4]),
      itbis: toNumber(m[5]),
      descuento: toNumber(m[6]),
      recargo: toNumber(m[7]),
      valor: toNumber(m[8]),
    })
  }
  return items
}

export function parseInvoiceText(text: string): ParsedInvoice {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  const encf = field(text, 'e-NCF')
  const codigoSeguridad = field(text, 'Código de Seguridad')
  const fechaFirma = field(text, 'Fecha de Firma Digital')
  const montoTotal = field(text, 'Monto Total')
  if (!encf || !codigoSeguridad || !fechaFirma || !montoTotal) {
    throw new Error('El PDF no parece una factura electrónica (faltan e-NCF, código de seguridad o monto total).')
  }

  // La dirección puede ocupar varias líneas hasta "Teléfono:"
  const dirStart = lines.findIndex((l) => l.startsWith('Dirección:'))
  const dirEnd = lines.findIndex((l, i) => i > dirStart && /^(Teléfono|Fecha Emisión):/.test(l))
  const emisorDireccion =
    dirStart === -1
      ? ''
      : lines
          .slice(dirStart, dirEnd === -1 ? dirStart + 1 : dirEnd)
          .join(' ')
          .replace(/^Dirección:\s*/, '')
          .replace(/\s+/g, ' ')

  const tipoEcf = encf.slice(0, 3)
  const parsed = {
    encf,
    tipoEcf,
    fechaEmision: field(text, 'Fecha Emisión') ?? '',
    fechaVencimiento: NA(field(text, 'Fecha Vencimiento')),
    emisorNombre: lines[0] ?? '',
    emisorRazonSocial: lines[1] ?? '',
    emisorRnc: field(text, 'RNC') ?? '',
    emisorDireccion,
    emisorTelefono: field(text, 'Teléfono'),
    clienteRazonSocial: NA(field(text, 'Razón Social Cliente')),
    clienteRnc: NA(field(text, 'RNC Cliente')),
    subtotalGravado: toNumber(field(text, 'Subtotal Gravado')),
    subtotalExento: toNumber(field(text, 'Subtotal Exento')),
    totalItbis: toNumber(field(text, 'Total ITBIS')),
    propinaLegal: toNumber(field(text, 'Propina Legal')),
    montoTotal: toNumber(montoTotal),
    codigoSeguridad,
    fechaFirma,
    items: parseItems(lines),
    rawText: text,
  }
  return { ...parsed, qrUrl: buildDgiiQrUrl(parsed) }
}

export async function parseInvoicePdf(data: Uint8Array): Promise<ParsedInvoice> {
  const pdf = await getDocumentProxy(data)
  const { text } = await extractText(pdf, { mergePages: true })
  return parseInvoiceText(text)
}

// Diferencia entre la suma de los componentes y el monto total (0 = cuadra)
export function totalMismatch(i: Pick<ParsedInvoice, 'subtotalGravado' | 'subtotalExento' | 'totalItbis' | 'propinaLegal' | 'montoTotal'>): number {
  const sum = i.subtotalGravado + i.subtotalExento + i.totalItbis + i.propinaLegal
  return Math.round((i.montoTotal - sum) * 100) / 100
}
