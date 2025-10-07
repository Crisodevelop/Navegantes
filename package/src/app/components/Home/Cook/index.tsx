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
       <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
  <p className="text-primary text-lg font-normal mb-3 tracking-widest uppercase">
    Nosotros
  </p>
  <h2 className="text-3xl font-semibold">
    Pasión por lo auténtico
  </h2>
  <p className="text-black/50 text-lg font-normal my-5 max-w-xl">
    Navegantes Restobar nació del amor por el mar, la cocina costera y la calidez de la hospitalidad caribeña. Inspirados por la brisa salada, los sabores tropicales y la alegría de compartir, creamos un espacio donde cada plato cuenta una historia.
  </p>
  <p className="text-black/50 text-lg font-normal mb-10 max-w-xl">
    Aquí no solo servimos comida: cocinamos con pasión, presentamos con arte y recibimos como en familia.
  </p>
  <a href="#reservar">
    <button className="text-xl font-medium rounded-full text-white py-3 px-8 duration-300 bg-primary w-fit border border-primary hover:bg-transparent hover:text-primary hover:cursor-pointer">
      Más información
    </button>
  </a>
</div>

        </div>
      </div>
    </section>
  )
}

export default Cook
