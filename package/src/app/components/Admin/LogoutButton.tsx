'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  return (
    <button
      className='text-sm text-gray-600 hover:text-black'
      onClick={async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
        router.replace('/admin/login')
      }}>
      Salir
    </button>
  )
}
