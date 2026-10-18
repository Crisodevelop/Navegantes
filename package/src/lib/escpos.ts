// Ticket para impresora térmica de 58 mm (384 puntos, 32 columnas con la fuente A).
// El ticket se describe como bloques y se convierte en comandos ESC/POS (RawBT) o en PNG.
import QRCode from 'qrcode'
import { formatMoney } from '@/lib/invoice/format'
import { tipoEcfLabel } from '@/lib/invoice/labels'
import type { StoredInvoice } from '@/lib/invoice/repo'

export const PAPER_DOTS = 384
export const COLS = 32

export type Bitmap = { width: number; height: number; data: Uint8Array } // 1 = negro, fila por fila
type Align = 'left' | 'center' | 'right'
export type Block =
  | { type: 'text'; text: string; align?: Align; bold?: boolean; tall?: boolean }
  | { type: 'image'; bitmap: Bitmap }
  | { type: 'feed'; lines: number }

// La impresora no tiene acentos en la página de códigos por defecto
export function plain(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7e]/g, '?')
}

export function lr(left: string, right: string, cols = COLS): string {
  const space = cols - left.length - right.length
  if (space >= 1) return left + ' '.repeat(space) + right
  return `${left}\n${' '.repeat(Math.max(0, cols - right.length))}${right}`
}

export function wrap(text: string, cols = COLS): string[] {
  const out: string[] = []
  let line = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = word
    else if (line.length + 1 + word.length <= cols) line += ' ' + word
    else {
      out.push(line)
      line = word
    }
    while (line.length > cols) {
      out.push(line.slice(0, cols))
      line = line.slice(cols)
    }
  }
  if (line) out.push(line)
  return out
}

const rule = (ch = '-'): Block => ({ type: 'text', text: ch.repeat(COLS) })

export function qrBitmap(url: string, maxDots = 264): Bitmap {
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' })
  const n = qr.modules.size
  const quiet = 2
  const scale = Math.max(1, Math.floor(maxDots / (n + quiet * 2)))
  const size = (n + quiet * 2) * scale
  const width = PAPER_DOTS
  const offset = Math.floor((width - size) / 2)
  const data = new Uint8Array(width * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const mx = Math.floor(x / scale) - quiet
      const my = Math.floor(y / scale) - quiet
      if (mx >= 0 && my >= 0 && mx < n && my < n && qr.modules.get(my, mx)) {
        data[y * width + offset + x] = 1
      }
    }
  }
  return { width, height: size, data }
}

// Carga una imagen (ya en blanco y negro) y la centra en el ancho del papel
export async function imageBitmap(src: string, targetWidth = 288): Promise<Bitmap> {
  const img = new Image()
  img.src = src
  await img.decode()
  const height = Math.round((img.height * targetWidth) / img.width)
  const canvas = document.createElement('canvas')
  canvas.width = PAPER_DOTS
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, PAPER_DOTS, height)
  ctx.drawImage(img, Math.floor((PAPER_DOTS - targetWidth) / 2), 0, targetWidth, height)
  const px = ctx.getImageData(0, 0, PAPER_DOTS, height).data
  const data = new Uint8Array(PAPER_DOTS * height)
  for (let i = 0; i < data.length; i++) {
    const lum = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]
    data[i] = lum < 128 ? 1 : 0
  }
  return { width: PAPER_DOTS, height, data }
}

export function buildTicket(inv: StoredInvoice, logo: Bitmap | null): Block[] {
  const t = (text: string, opts: Omit<Extract<Block, { type: 'text' }>, 'type' | 'text'> = {}): Block => ({
    type: 'text',
    text: plain(text),
    ...opts,
  })
  const blocks: Block[] = []
  if (logo) blocks.push({ type: 'image', bitmap: logo }, { type: 'feed', lines: 1 })

  blocks.push(t(inv.emisorNombre, { align: 'center', bold: true, tall: true }))
  if (inv.emisorRazonSocial && inv.emisorRazonSocial !== inv.emisorNombre) {
    blocks.push(t(inv.emisorRazonSocial, { align: 'center', bold: true }))
  }
  blocks.push(t(`RNC: ${inv.emisorRnc}`, { align: 'center', bold: true }))
  for (const line of wrap(plain(inv.emisorDireccion))) blocks.push(t(line, { align: 'center' }))
  if (inv.emisorTelefono) blocks.push(t(`Tel: ${inv.emisorTelefono}`, { align: 'center' }))

  blocks.push(rule())
  for (const line of wrap(plain(tipoEcfLabel(inv.tipoEcf)).toUpperCase())) {
    blocks.push(t(line, { align: 'center', bold: true }))
  }
  blocks.push(t(lr('e-NCF:', inv.encf), { bold: true }))
  blocks.push(t(lr('Fecha emision:', inv.fechaEmision)))
  if (inv.fechaVencimiento) blocks.push(t(lr('Vencimiento:', inv.fechaVencimiento)))
  blocks.push(t(lr('Cliente:', inv.clienteRazonSocial ?? 'N/A')))
  blocks.push(t(lr('RNC cliente:', inv.clienteRnc ?? 'N/A')))

  blocks.push(rule())
  for (const it of inv.items) {
    for (const line of wrap(plain(it.descripcion))) blocks.push(t(line, { bold: true }))
    blocks.push(t(lr(` ${formatMoney(it.cantidad)} ${it.unidad} x ${formatMoney(it.precio)}`, formatMoney(it.valor)), { bold: true }))
    if (it.itbis) blocks.push(t(lr(' ITBIS', formatMoney(it.itbis))))
    if (it.descuento) blocks.push(t(lr(' Descuento', `-${formatMoney(it.descuento)}`)))
    if (it.recargo) blocks.push(t(lr(' Recargo', formatMoney(it.recargo))))
  }

  blocks.push(rule())
  blocks.push(t(lr('Subtotal gravado', formatMoney(inv.subtotalGravado)), { bold: true }))
  if (inv.subtotalExento) blocks.push(t(lr('Subtotal exento', formatMoney(inv.subtotalExento)), { bold: true }))
  blocks.push(t(lr('Total ITBIS', formatMoney(inv.totalItbis)), { bold: true }))
  if (inv.propinaLegal) blocks.push(t(lr('Propina legal', formatMoney(inv.propinaLegal)), { bold: true }))
  blocks.push(rule('='))
  blocks.push(t(lr('TOTAL RD$', formatMoney(inv.montoTotal)), { bold: true, tall: true }))
  blocks.push(rule('='))

  blocks.push({ type: 'feed', lines: 1 })
  blocks.push({ type: 'image', bitmap: qrBitmap(inv.qrUrl) })
  blocks.push(t(`Codigo de seguridad: ${inv.codigoSeguridad}`, { align: 'center', bold: true }))
  blocks.push(t('Fecha de firma digital:', { align: 'center' }))
  blocks.push(t(inv.fechaFirma, { align: 'center' }))
  blocks.push({ type: 'feed', lines: 1 })
  blocks.push(t('Gracias por su visita!', { align: 'center', bold: true }))
  blocks.push({ type: 'feed', lines: 4 })
  return blocks
}

// ---------- ESC/POS ----------
const ALIGN: Record<Align, number> = { left: 0, center: 1, right: 2 }

export function toEscPos(blocks: Block[]): Uint8Array {
  const out: number[] = [0x1b, 0x40] // ESC @ reinicia
  const push = (...b: number[]) => out.push(...b)
  for (const b of blocks) {
    if (b.type === 'feed') {
      push(0x1b, 0x64, b.lines)
    } else if (b.type === 'text') {
      push(0x1b, 0x61, ALIGN[b.align ?? 'left'])
      push(0x1b, 0x45, b.bold ? 1 : 0)
      push(0x1d, 0x21, b.tall ? 0x01 : 0x00) // doble alto, mismo ancho
      for (const ch of b.text) push(ch.charCodeAt(0) & 0x7f)
      push(0x0a)
    } else {
      const { width, height, data } = b.bitmap
      const bytesPerRow = Math.ceil(width / 8)
      push(0x1b, 0x61, 0)
      push(0x1d, 0x76, 0x30, 0x00, bytesPerRow & 0xff, bytesPerRow >> 8, height & 0xff, height >> 8)
      for (let y = 0; y < height; y++) {
        for (let xb = 0; xb < bytesPerRow; xb++) {
          let byte = 0
          for (let bit = 0; bit < 8; bit++) {
            const x = xb * 8 + bit
            if (x < width && data[y * width + x]) byte |= 0x80 >> bit
          }
          push(byte)
        }
      }
    }
  }
  push(0x1b, 0x45, 0, 0x1d, 0x21, 0, 0x1b, 0x61, 0)
  return new Uint8Array(out)
}

export function rawbtIntentUrl(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return `intent:base64,${btoa(bin)}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`
}

// ---------- PNG (respaldo: compartir la imagen a RawBT) ----------
const CHAR_W = PAPER_DOTS / COLS // 12 puntos por carácter
const LINE_H = 26

export function toCanvas(blocks: Block[]): HTMLCanvasElement {
  let height = 8
  for (const b of blocks) {
    if (b.type === 'feed') height += b.lines * LINE_H
    else if (b.type === 'text') height += b.text.split('\n').length * LINE_H * (b.tall ? 2 : 1)
    else height += b.bitmap.height
  }
  const canvas = document.createElement('canvas')
  canvas.width = PAPER_DOTS
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, PAPER_DOTS, height)
  ctx.fillStyle = '#000'
  ctx.textBaseline = 'top'
  let y = 4
  for (const b of blocks) {
    if (b.type === 'feed') {
      y += b.lines * LINE_H
    } else if (b.type === 'image') {
      const img = ctx.createImageData(b.bitmap.width, b.bitmap.height)
      b.bitmap.data.forEach((v, i) => {
        const c = v ? 0 : 255
        img.data.set([c, c, c, 255], i * 4)
      })
      ctx.putImageData(img, 0, y)
      y += b.bitmap.height
    } else {
      const lineH = LINE_H * (b.tall ? 2 : 1)
      for (const line of b.text.split('\n')) {
        ctx.save()
        const w = line.length * CHAR_W
        const x = b.align === 'center' ? (PAPER_DOTS - w) / 2 : b.align === 'right' ? PAPER_DOTS - w : 0
        ctx.translate(0, y)
        if (b.tall) ctx.scale(1, 2)
        ctx.font = `${b.bold ? 'bold ' : ''}20px "Courier New", monospace`
        for (let i = 0; i < line.length; i++) ctx.fillText(line[i], x + i * CHAR_W, 2)
        ctx.restore()
        y += lineH
      }
    }
  }
  return canvas
}
