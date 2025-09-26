'use client'
import React from 'react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const ContactButtons = () => {
  return (
    <section id='reservar' className='scroll-mt-20 py-12'>
      <div className='container text-center'>
        <h2 className='mb-10 font-bold tracking-tight text-4xl md:text-6xl lg:text-7xl text-gray-900'>
          Contáctanos
        </h2>

        <div className='flex justify-center gap-6'>
          <a
            href='https://www.instagram.com/navegantesrestobar/'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full shadow-sm hover:shadow-md hover:border-pink-500 hover:text-pink-600 transition duration-300'>
            <FaInstagram size={20} />
            Instagram
          </a>

          <a
            href='https://wa.link/96w8rb'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full shadow-sm hover:shadow-md hover:border-green-500 hover:text-green-600 transition duration-300'>
            <FaWhatsapp size={20} />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default ContactButtons
