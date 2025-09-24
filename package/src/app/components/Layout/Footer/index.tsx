'use client'

import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Logo from '../Header/Logo'
import { FooterLinkType } from '@/app/types/footerlink'

const Footer: FC = () => {
  const [footerlink, SetFooterlink] = useState<FooterLinkType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        SetFooterlink(data.FooterLinkData)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  // Excluye la sección Support/Soporte
  const filteredFooterlink = footerlink.filter((section) => {
    const sec = (section.section || '').toLowerCase().trim()
    return sec !== 'support' && sec !== 'soporte'
  })

  return (
    <footer className='pt-8'>
      <div className='container'>
        {/* ==== GRID SIN ESPACIOS ==== */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-20 md:gap-24 pb-10'>
          {/* Logo y descripción */}
          <div className='col-span-1'>
            <Logo />
            <p className='text-sm font-medium text-grey my-5 max-w-[70%]'>
              Navegante resto bar una experiencia única que combina sabores del mar
            </p>
            <div className='flex gap-6 items-center'>
              <Link
                href='https://www.instagram.com/navegantesrestobar/'
                className='group bg-white hover:bg-primary rounded-full shadow-xl p-3'>
                <Icon
                  icon='fa6-brands:instagram'
                  width='16'
                  height='16'
                  className='group-hover:text-white text-black'
                />
              </Link>
            </div>
          </div>

          {/* Enlaces dinámicos (sin Support) */}
          <div className="flex flex-wrap justify-between w-full">
            {filteredFooterlink.map((product) => (
              <div key={product.section} className="group relative min-w-[150px] flex-1">
                <p className="text-black text-xl font-semibold mb-9">
                  {product.section}
                </p>
                <ul>
                  {product.links.map((item, idx) => (
                    <li key={idx} className="mb-3">
                      <Link
                        href={item.href}
                        className="text-black/60 hover:text-black text-base font-normal">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>


          {/* Contacto */}
          <div className='col-span-1'>
            <div className='flex flex-col gap-5'>
              <div className='flex'>
                <Icon
                  icon='solar:point-on-map-perspective-bold'
                  className='text-primary text-3xl lg:text-2xl inline-block me-2'
                />
                <p className='text-black text-base'>
                  Calle de la Bahia 5, Bayahíbe 23200
                </p>
              </div>
              <Link href='tel:+1(809) 505-2208'>
                <div className='flex'>
                  <Icon
                    icon='solar:phone-bold'
                    className='text-primary text-3xl lg:text-2xl inline-block me-2'
                  />
                  <p className='text-black/60 hover:text-black text-base'>
                    +1(809) 505-2208
                  </p>
                </div>
              </Link>
              <Link href='/'>
                <div className='flex'>
                  <Icon
                    icon='solar:mailbox-bold'
                    className='text-primary text-3xl lg:text-2xl inline-block me-2'
                  />
                  <p className='text-black/60 hover:text-black text-base'>
                    naveganterestobar@gmail.com
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ==== Footer inferior ==== */}
        <div className='border-t border-grey/15 py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-5'>
          <p className='text-sm text-black/70'>
            @2025 - Naveganterestobar. All Rights Reserved by{' '}
            <Link
              href='https://www.crisodevelop.com/'
              className='hover:text-primary hover:underline'>
              Crisodevelop
            </Link>
          </p>

          <div>
            <Link
              href='#'
              className='text-sm text-black/70 px-5 border-r border-grey/15 hover:text-primary hover:underline'>
              Privacy policy
            </Link>
            <Link
              href='#'
              className='text-sm text-black/70 px-5 hover:text-primary hover:underline'>
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
