const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// 3000 -> "3,000.00" (mismo formato que la factura de la DGII)
export function formatMoney(n: number): string {
  return money.format(n)
}
