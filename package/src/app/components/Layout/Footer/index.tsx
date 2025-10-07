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

  const filteredFooterlink = footerlink.filter((section) => {
    const sec = (section.section || '').toLowerCase().trim()
    return sec !== 'support' && sec !== 'soporte'
  })

  return (
    <footer className="pt-8">
      <div className="container">
        {/* ==== GRID ==== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-20 md:gap-24 pb-10 text-center sm:text-left">

          {/* Logo y descripción */}
          <div className="col-span-1 flex flex-col text-center sm:text-left sm:items-start items-center">
            <div className="flex flex-col items-center sm:items-start w-full">
              <Logo />
              <p className="text-sm font-medium text-grey my-5 w-full sm:max-w-[70%] sm:mx-0 mx-auto">
                Navegante resto bar: una experiencia única que combina sabores del mar
              </p>
            </div>

            <div className="flex gap-6 justify-center sm:justify-start items-center">
              <Link
                href="https://www.instagram.com/navegantesrestobar/"
                className="group bg-white hover:bg-primary rounded-full shadow-xl p-3"
              >
                <Icon
                  icon="fa6-brands:instagram"
                  width="16"
                  height="16"
                  className="group-hover:text-white text-black"
                />
              </Link>
            </div>
          </div>

          {/* Enlaces dinámicos */}
          <div className="flex flex-wrap justify-center sm:justify-between w-full">
            {filteredFooterlink.map((product) => (
              <div key={product.section} className="group relative min-w-[150px] flex-1 mb-6 sm:mb-0">
                <p className="text-black text-xl font-semibold mb-5">
                  {product.section}
                </p>
                <ul>
                  {product.links.map((item, idx) => (
                    <li key={idx} className="mb-3">
                      <Link
                        href={item.href}
                        className="text-black/60 hover:text-black text-base font-normal"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div className="col-span-1 flex flex-col gap-5 items-center sm:items-start">
            <div className="flex justify-center sm:justify-start items-center">
              <Icon
                icon="solar:point-on-map-perspective-bold"
                className="text-primary text-3xl lg:text-2xl inline-block me-2"
              />
              <Link target="_blank" href="https://maps.app.goo.gl/MgHrnvVhHz6ULk2G6">
                <p className="text-black text-base">Calle de la Bahia 5, Bayahíbe 23200</p>
              </Link>
            </div>
            <Link target="_blank" href="tel:+1(809) 505-2208">
              <div className="flex justify-center sm:justify-start items-center">
                <Icon
                  icon="solar:phone-bold"
                  className="text-primary text-3xl lg:text-2xl inline-block me-2"
                />
                <p className="text-black/60 hover:text-black text-base">
                  +1(809) 505-2208
                </p>
              </div>
            </Link>
            <Link href="/">
              <div className="flex justify-center sm:justify-start items-center">
                <Icon
                  icon="solar:mailbox-bold"
                  className="text-primary text-3xl lg:text-2xl inline-block me-2"
                />
                <p className="text-black/60 hover:text-black text-base">
                  naveganterestobar@gmail.com
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* ==== Footer inferior ==== */}
        <div className="border-t border-grey/15 py-5 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-5 text-center sm:text-left">
          <p className="text-sm text-black/70">
            @2025 - Naveganterestobar. All Rights Reserved by{' '}
            <Link
              href="https://www.crisodevelop.com/"
              className="hover:text-primary hover:underline"
            >
              Crisodevelop
            </Link>
          </p>

          <p className="text-sm text-black/70 px-5 hover:text-primary hover:underline">
            Navegantes donde el mar encuentra tu paladar
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
