'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const next = useSearchParams().get('next')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? 'Error')
      return
    }
    router.replace(next?.startsWith('/admin') ? next : '/admin/facturas')
  }

  return (
    <form onSubmit={submit} className='mx-auto mt-24 flex max-w-xs flex-col gap-3 rounded-xl bg-white p-6 shadow'>
      <h1 className='text-xl font-bold'>Admin Tripulantes</h1>
      <input
        type='password'
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Contraseña'
        className='rounded-lg border border-gray-300 px-3 py-2'
      />
      {error && <p className='text-sm text-red-600'>{error}</p>}
      <button disabled={loading} className='rounded-lg bg-primary py-2 font-semibold text-white disabled:opacity-50'>
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
