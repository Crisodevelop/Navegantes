const TIPOS: Record<string, string> = {
  E31: 'Factura de Crédito Fiscal Electrónica',
  E32: 'Factura de Consumo Electrónica',
  E33: 'Nota de Débito Electrónica',
  E34: 'Nota de Crédito Electrónica',
}

export function tipoEcfLabel(tipo: string): string {
  return TIPOS[tipo] ?? 'Comprobante Fiscal Electrónico'
}
