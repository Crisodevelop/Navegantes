'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { FeaturesType } from '@/app/types/features'
import FeaturesSkeleton from '../../Skeleton/Features'

const Features = () => {
  const [features, setFeatures] = useState<FeaturesType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setFeatures(data.FeaturesData)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section id='features'>
      <div className='container'>
        <div className='text-center mb-14'>
          <p className='text-primary text-lg font-normal tracking-widest uppercase'>
            ¿Por qué elegirnos?
          </p>
          <h2 className='font-semibold lg:max-w-60% mx-auto mt-3'>
Vive más que una comida, vive una experiencia con vista al mar          </h2>
        </div>
        {/* Desktop Grid */}
        <div className='hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-y-28 gap-x-6 mt-24'>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <FeaturesSkeleton key={i} />
              ))
            : features.map((items, i) => (
                <div
                  key={i}
                  className='p-8 relative rounded-3xl bg-gradient-to-b from-primary/10 to-white shadow-[0_8px_30px_rgba(25,121,203,0.15)] hover:shadow-[0_12px_40px_rgba(25,121,203,0.25)] hover:scale-105 transition duration-300 ease-in-out hover:cursor-pointer'>
                  <div className='rounded-full flex justify-center absolute sm:top-[-40%] md:top-[-55%] lg:top-[-35%] left-0'>
                    <Image
                      src={items.imgSrc}
                      alt={items.imgSrc}
                      width={510}
                      height={10}
                    />
                  </div>
                  <p className='text-2xl text-black font-semibold text-center mt-16'>
                    {items.heading}
                  </p>
                  <p className='text-base font-normal text-black/50 text-center mt-2 leading-6'>
                    {items.subheading}
                  </p>
                </div>
              ))}
        </div>

        {/* Mobile Layout - Horizontal Cards */}
        <div className='flex sm:hidden flex-col gap-5 mt-8'>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <FeaturesSkeleton key={i} />
              ))
            : features.map((items, i) => (
                <div
                  key={i}
                  className='flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-white shadow-[0_4px_20px_rgba(25,121,203,0.12)]'>
                  <div className='flex-shrink-0 w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden'>
                    <Image
                      src={items.imgSrc}
                      alt={items.imgSrc}
                      width={250}
                      height={250}
                      className='w-44 h-44 object-contain scale-150 translate-y-7'
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='text-lg text-black font-semibold'>
                      {items.heading}
                    </p>
                    <p className='text-sm font-normal text-black/50 mt-1 leading-5'>
                      {items.subheading}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}

export default Features
