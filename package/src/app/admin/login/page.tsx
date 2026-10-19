'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiArrowLeft, FiEye, FiEyeOff, FiLock } from 'react-icons/fi'

function LoginForm() {
  const router = useRouter()
  const next = useSearchParams().get('next')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
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
    if (!res.ok) {
      setLoading(false)
      setError((await res.json().catch(() => ({}))).error ?? 'Error')
      return
    }
    router.replace(next?.startsWith('/admin') ? next : '/admin/facturas')
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1f33] px-4 py-10'>
      {/* Fondo: degradado marino + rosa de los vientos tenue */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,#1979cb55,transparent_55%),radial-gradient(circle_at_85%_90%,#c8783a40,transparent_50%)]' />
      <Image
        src='/images/Logo/tripulantes-ticket.png'
        alt=''
        width={720}
        height={720}
        className='pointer-events-none absolute -right-40 -bottom-40 w-[520px] opacity-[0.04] invert sm:w-[720px]'
        priority
      />

      <div className='relative w-full max-w-sm'>
        <div className='rounded-3xl bg-white p-8 shadow-2xl shadow-black/40'>
          <div className='mb-6 flex flex-col items-center text-center'>
            <div className='mb-4 rounded-full bg-white p-1.5 shadow-lg ring-4 ring-[#1979cb]/15'>
              <Image
                src='/images/Logo/tripulantes-logo.jpg'
                alt='Tripulantes Resto Bar'
                width={112}
                height={112}
                className='h-28 w-28 rounded-full object-cover'
                priority
              />
            </div>
            <h1 className='text-2xl! font-bold tracking-tight text-[#0b1f33]'>Tripulantes Resto Bar</h1>
            <p className='mt-1 text-sm text-gray-500'>Panel de administración</p>
          </div>

          <form onSubmit={submit} className='flex flex-col gap-4'>
            <label className='flex flex-col gap-1.5'>
              <span className='text-sm font-medium text-gray-700'>Contraseña</span>
              <div
                className={`flex items-center gap-2 rounded-xl border bg-white px-3 transition focus-within:ring-4 ${
                  error
                    ? 'border-red-400 focus-within:ring-red-100'
                    : 'border-gray-300 focus-within:border-[#1979cb] focus-within:ring-[#1979cb]/15'
                }`}>
                <FiLock className='shrink-0 text-gray-400' />
                <input
                  type={show ? 'text' : 'password'}
                  autoFocus
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder='••••••••'
                  className='w-full bg-transparent py-3 text-base outline-none'
                />
                <button
                  type='button'
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className='shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-700'>
                  {show ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </label>

            {error && (
              <p role='alert' className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
                {error}
              </p>
            )}

            <button
              disabled={loading || !password}
              className='flex items-center justify-center gap-2 rounded-xl bg-[#1979cb] py-3 text-base font-semibold text-white shadow-lg shadow-[#1979cb]/30 transition hover:bg-[#1566ab] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'>
              {loading && <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />}
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <Link
          href='/'
          className='mt-6 flex items-center justify-center gap-1.5 text-sm text-white/70 transition hover:text-white'>
          <FiArrowLeft /> Volver al sitio
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
