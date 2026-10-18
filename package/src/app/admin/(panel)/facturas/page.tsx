import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatMoney } from '@/lib/invoice/format'

export const dynamic = 'force-dynamic'

export default async function FacturasPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const invoices = await prisma.invoice.findMany({
    where: q ? { encf: { contains: q.trim(), mode: 'insensitive' } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, encf: true, fechaEmision: true, montoTotal: true, clienteRazonSocial: true },
  })

  return (
    <div>
      <div className='mb-4 flex flex-wrap items-center gap-3'>
        <h1 className='text-2xl! font-bold'>Facturas</h1>
        <form className='ml-auto'>
          <input
            name='q'
            defaultValue={q}
            placeholder='Buscar e-NCF'
            className='rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm'
          />
        </form>
      </div>
      {invoices.length === 0 ? (
        <p className='rounded-xl bg-white p-6 text-center text-gray-600'>
          No hay facturas todavía. <Link href='/admin/facturas/nueva' className='text-primary underline'>Sube la primera</Link>.
        </p>
      ) : (
        <div className='overflow-x-auto rounded-xl bg-white shadow-sm'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100 text-left'>
              <tr>
                <th className='px-3 py-2'>Fecha</th>
                <th className='px-3 py-2'>e-NCF</th>
                <th className='px-3 py-2'>Cliente</th>
                <th className='px-3 py-2 text-right'>Total RD$</th>
                <th className='px-3 py-2' />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className='border-t border-gray-100'>
                  <td className='px-3 py-2 whitespace-nowrap'>{inv.fechaEmision}</td>
                  <td className='px-3 py-2 font-mono'>{inv.encf}</td>
                  <td className='px-3 py-2'>{inv.clienteRazonSocial ?? 'N/A'}</td>
                  <td className='px-3 py-2 text-right font-semibold tabular-nums'>{formatMoney(inv.montoTotal.toNumber())}</td>
                  <td className='px-3 py-2 text-right'>
                    <Link href={`/admin/facturas/${inv.id}`} className='rounded-lg bg-black px-3 py-1.5 text-white'>
                      Imprimir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
