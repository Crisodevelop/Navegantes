import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { FiChevronLeft, FiChevronRight, FiPrinter, FiSearch, FiX } from 'react-icons/fi'
import { prisma } from '@/lib/db'
import { formatMoney } from '@/lib/invoice/format'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 15

// Busca por e-NCF, cliente, RNC del cliente, fecha (dd-mm-aaaa), artículo o monto total
function searchWhere(q: string): Prisma.InvoiceWhereInput | undefined {
  if (!q) return undefined
  const contains = { contains: q, mode: 'insensitive' as const }
  const or: Prisma.InvoiceWhereInput[] = [
    { encf: contains },
    { clienteRazonSocial: contains },
    { clienteRnc: contains },
    { fechaEmision: contains },
    { items: { some: { descripcion: contains } } },
  ]
  const amount = Number(q.replace(/,/g, ''))
  if (q && Number.isFinite(amount)) or.push({ montoTotal: amount })
  return { OR: or }
}

function pageHref(q: string, page: number) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (page > 1) params.set('page', String(page))
  const s = params.toString()
  return `/admin/facturas${s ? `?${s}` : ''}`
}

export default async function FacturasPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams
  const q = (sp.q ?? '').trim()
  const where = searchWhere(q)

  const total = await prisma.invoice.count({ where })
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(pages, Math.max(1, Number(sp.page) || 1))
  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: { id: true, encf: true, fechaEmision: true, montoTotal: true, clienteRazonSocial: true },
  })
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(total, page * PAGE_SIZE)

  return (
    <div>
      <h1 className='mb-4 text-2xl! font-bold'>Facturas</h1>

      <form className='mb-4 flex gap-2' role='search'>
        <div className='flex flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15'>
          <FiSearch className='shrink-0 text-gray-400' />
          <input
            name='q'
            type='search'
            defaultValue={q}
            placeholder='Buscar e-NCF, cliente, fecha…'
            className='w-full bg-transparent py-2.5 text-base outline-none'
          />
          {q && (
            <Link href='/admin/facturas' aria-label='Limpiar búsqueda' className='shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-700'>
              <FiX />
            </Link>
          )}
        </div>
        <button className='rounded-xl bg-black px-4 text-sm font-semibold text-white'>Buscar</button>
      </form>

      {total > 0 && (
        <p className='mb-2 text-sm text-gray-500'>
          {q ? `${total} resultado${total === 1 ? '' : 's'} para “${q}”` : `${total} factura${total === 1 ? '' : 's'}`}
          {pages > 1 && ` · mostrando ${from}–${to}`}
        </p>
      )}

      {invoices.length === 0 ? (
        <p className='rounded-xl bg-white p-6 text-center text-gray-600'>
          {q ? (
            <>No se encontraron facturas para “{q}”.</>
          ) : (
            <>
              No hay facturas todavía.{' '}
              <Link href='/admin/facturas/nueva' className='text-primary underline'>Sube la primera</Link>.
            </>
          )}
        </p>
      ) : (
        <>
          {/* Móvil: tarjetas */}
          <ul className='flex flex-col gap-2 sm:hidden'>
            {invoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/admin/facturas/${inv.id}`}
                  className='flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm active:bg-gray-50'>
                  <div className='min-w-0 flex-1'>
                    <p className='font-mono text-sm font-semibold'>{inv.encf}</p>
                    <p className='truncate text-sm text-gray-500'>
                      {inv.fechaEmision} · {inv.clienteRazonSocial ?? 'Consumidor final'}
                    </p>
                    <p className='mt-1 text-lg font-bold tabular-nums'>RD$ {formatMoney(inv.montoTotal.toNumber())}</p>
                  </div>
                  <span className='flex shrink-0 items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white'>
                    <FiPrinter /> Imprimir
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Escritorio: tabla */}
          <div className='hidden overflow-hidden rounded-xl bg-white shadow-sm sm:block'>
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
                      <Link
                        href={`/admin/facturas/${inv.id}`}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-white'>
                        <FiPrinter /> Imprimir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <nav aria-label='Paginación' className='mt-4 flex items-center justify-between gap-2'>
              {page > 1 ? (
                <Link href={pageHref(q, page - 1)} className='flex items-center gap-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-sm'>
                  <FiChevronLeft /> Anterior
                </Link>
              ) : (
                <span className='flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm text-gray-300'>
                  <FiChevronLeft /> Anterior
                </span>
              )}
              <span className='text-sm text-gray-600'>
                Página {page} de {pages}
              </span>
              {page < pages ? (
                <Link href={pageHref(q, page + 1)} className='flex items-center gap-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-sm'>
                  Siguiente <FiChevronRight />
                </Link>
              ) : (
                <span className='flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm text-gray-300'>
                  Siguiente <FiChevronRight />
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  )
}
