import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Tripulantes',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className='admin-root min-h-screen bg-gray-50 text-black'>{children}</div>
}
