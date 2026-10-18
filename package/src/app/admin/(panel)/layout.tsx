import Link from 'next/link'
import LogoutButton from '@/app/components/Admin/LogoutButton'

export default function PanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className='no-print border-b border-gray-200 bg-white'>
        <nav className='mx-auto flex max-w-4xl items-center gap-4 px-4 py-3'>
          <Link href='/admin/facturas' className='font-bold'>Tripulantes · Admin</Link>
          <Link href='/admin/facturas/nueva' className='ml-auto rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white'>
            + Subir factura
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className='mx-auto max-w-4xl px-4 py-6'>{children}</main>
    </>
  )
}
