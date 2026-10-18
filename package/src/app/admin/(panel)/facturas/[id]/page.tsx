import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { getInvoice } from '@/lib/invoice/repo'
import Receipt from '@/app/components/Admin/Receipt'
import PrintActions from '@/app/components/Admin/PrintActions'

export const dynamic = 'force-dynamic'

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoice(id)
  if (!invoice) notFound()
  const qrDataUrl = await QRCode.toDataURL(invoice.qrUrl, { errorCorrectionLevel: 'M', margin: 1, scale: 8 })

  return (
    <div>
      <PrintActions invoice={invoice} />
      <div className='receipt-preview mx-auto bg-white shadow'>
        <Receipt invoice={invoice} qrDataUrl={qrDataUrl} />
      </div>
    </div>
  )
}
