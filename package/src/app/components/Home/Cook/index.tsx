'use client'

import Image from 'next/image'

const Cook = () => {
  return (
    <section className='relative' id='aboutus'>
      <div className='container px-4'>
        <div className='absolute right-0 bottom-[-18%] xl:block hidden'>
          <Image
            src='/images/Cook/skewer.webp'
            alt='burger-image'
            width={463}
            height={622}
          />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-12 my-16 space-x-5'>
          <div className='lg:col-span-6 flex lg:justify-start justify-center'>
            <Image
              src='/images/Cook/cook.webp'
              alt='nothing'
              width={636}
              height={808}
            />
          </div>
          <div className='lg:col-span-6 flex flex-col justify-center items-center lg:items-start'>
            <p className='text-primary text-lg font-normal mb-3 tracking-widest uppercase lg:text-start text-center'>
              Sobre nosotros
            </p>
            <h2 className='lg:text-start text-center'>
              Pasión por lo auténtico
            </h2>
            <p className='text-black/50 text-lg font-normal my-5 text-start'>
              Navegantes Restobar nació del amor por la cocina costera y la hospitalidad. Inspirados por la brisa marina, los pescados recién capturados, los sabores tropicales, y la alegría de compartir, hemos creado un espacio donde cada plato cuenta una historia.
            </p>
            <p className='text-black/50 text-lg font-normal mb-10 text-start'>
              Aquí no sólo servimos comida: cocinamos con corazón, presentamos con arte, y recibimos con familia.
            </p>
            <button className='text-xl font-medium rounded-full text-white py-3 px-8 duration-300 bg-primary w-fit border border-primary hover:bg-transparent hover:text-primary hover:cursor-pointer'>
              Más información
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cook
