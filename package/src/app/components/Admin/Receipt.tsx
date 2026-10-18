import { formatMoney } from '@/lib/invoice/format'
import { tipoEcfLabel } from '@/lib/invoice/labels'
import type { StoredInvoice } from '@/lib/invoice/repo'

// Ticket para imprimir desde el navegador (USB). Ancho imprimible de 58 mm = 48 mm.
const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex justify-between gap-2 ${strong ? 'font-bold' : ''}`}>
    <span>{label}</span>
    <span className='receipt-num text-right'>{value}</span>
  </div>
)

const Rule = ({ double }: { double?: boolean }) => (
  <hr className={`my-1.5 border-0 border-t-2 border-black ${double ? 'border-double border-t-4' : 'border-dashed'}`} />
)

export default function Receipt({ invoice: inv, qrDataUrl }: { invoice: StoredInvoice; qrDataUrl: string }) {
  return (
    <div className='receipt'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src='/images/Logo/tripulantes-ticket.png' alt='Tripulantes Resto Bar' className='mx-auto mb-1 w-[34mm]' />
      <div className='text-center'>
        <p className='text-[15px] font-bold leading-tight'>{inv.emisorNombre}</p>
        {inv.emisorRazonSocial !== inv.emisorNombre && <p className='font-bold'>{inv.emisorRazonSocial}</p>}
        <p className='font-bold'>RNC: {inv.emisorRnc}</p>
        <p>{inv.emisorDireccion}</p>
        {inv.emisorTelefono && <p>Tel: {inv.emisorTelefono}</p>}
      </div>

      <Rule />
      <p className='text-center font-bold uppercase'>{tipoEcfLabel(inv.tipoEcf)}</p>
      <Row label='e-NCF:' value={inv.encf} strong />
      <Row label='Fecha emisión:' value={inv.fechaEmision} />
      {inv.fechaVencimiento && <Row label='Vencimiento:' value={inv.fechaVencimiento} />}
      <Row label='Cliente:' value={inv.clienteRazonSocial ?? 'N/A'} />
      <Row label='RNC cliente:' value={inv.clienteRnc ?? 'N/A'} />

      <Rule />
      {inv.items.map((it, i) => (
        <div key={i} className='mb-1'>
          <p className='font-bold'>{it.descripcion}</p>
          <Row label={`${formatMoney(it.cantidad)} ${it.unidad} x ${formatMoney(it.precio)}`} value={formatMoney(it.valor)} strong />
          {it.itbis > 0 && <Row label='ITBIS' value={formatMoney(it.itbis)} />}
          {it.descuento > 0 && <Row label='Descuento' value={`-${formatMoney(it.descuento)}`} />}
          {it.recargo > 0 && <Row label='Recargo' value={formatMoney(it.recargo)} />}
        </div>
      ))}

      <Rule />
      <Row label='Subtotal gravado' value={formatMoney(inv.subtotalGravado)} strong />
      {inv.subtotalExento > 0 && <Row label='Subtotal exento' value={formatMoney(inv.subtotalExento)} strong />}
      <Row label='Total ITBIS' value={formatMoney(inv.totalItbis)} strong />
      {inv.propinaLegal > 0 && <Row label='Propina legal' value={formatMoney(inv.propinaLegal)} strong />}
      <Rule double />
      <div className='flex justify-between text-[16px] font-bold'>
        <span>TOTAL RD$</span>
        <span className='receipt-num'>{formatMoney(inv.montoTotal)}</span>
      </div>
      <Rule double />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} alt='Código QR DGII' className='mx-auto my-1 w-[30mm]' style={{ imageRendering: 'pixelated' }} />
      <div className='text-center'>
        <p className='font-bold'>Código de seguridad: {inv.codigoSeguridad}</p>
        <p>Fecha de firma digital:</p>
        <p>{inv.fechaFirma}</p>
        <p className='mt-2 font-bold'>¡Gracias por su visita!</p>
      </div>
    </div>
  )
}
