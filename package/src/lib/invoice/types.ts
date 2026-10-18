export type ParsedItem = {
  cantidad: number
  descripcion: string
  unidad: string
  precio: number
  itbis: number
  descuento: number
  recargo: number
  valor: number
}

export type ParsedInvoice = {
  encf: string
  tipoEcf: string
  fechaEmision: string
  fechaVencimiento: string | null
  emisorNombre: string
  emisorRazonSocial: string
  emisorRnc: string
  emisorDireccion: string
  emisorTelefono: string | null
  clienteRazonSocial: string | null
  clienteRnc: string | null
  subtotalGravado: number
  subtotalExento: number
  totalItbis: number
  propinaLegal: number
  montoTotal: number
  codigoSeguridad: string
  fechaFirma: string
  qrUrl: string
  items: ParsedItem[]
  rawText: string
}
