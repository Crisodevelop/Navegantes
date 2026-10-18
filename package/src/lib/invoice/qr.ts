// URL del código QR de la DGII para un e-CF.
// Factura de consumo (E32) menor a RD$250,000 usa el endpoint simplificado.
const LIMITE_CONSUMO = 250000

type QrInput = {
  emisorRnc: string
  clienteRnc: string | null
  encf: string
  fechaEmision: string
  montoTotal: number
  fechaFirma: string
  codigoSeguridad: string
}

export function buildDgiiQrUrl(i: QrInput): string {
  const monto = i.montoTotal.toFixed(2)
  if (i.encf.startsWith('E32') && i.montoTotal < LIMITE_CONSUMO) {
    const q = new URLSearchParams({
      rncemisor: i.emisorRnc,
      encf: i.encf,
      montototal: monto,
      codigoseguridad: i.codigoSeguridad,
    })
    return `https://fc.dgii.gov.do/ecf/ConsultaTimbreFC?${q}`
  }
  const q = new URLSearchParams({
    rncemisor: i.emisorRnc,
    rnccomprador: i.clienteRnc ?? '',
    encf: i.encf,
    fechaemision: i.fechaEmision,
    montototal: monto,
    fechafirma: i.fechaFirma,
    codigoseguridad: i.codigoSeguridad,
  })
  return `https://ecf.dgii.gov.do/ecf/ConsultaTimbre?${q}`
}
