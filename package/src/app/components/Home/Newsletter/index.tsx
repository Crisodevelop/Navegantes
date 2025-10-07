'use client'
import Image from 'next/image'

const Newsletter = () => {
  return (
    <section className='relative overflow-hidden md:py-20'>
      <div className='container'>
        <div className='bg-primary rounded-2xl grid grid-cols-1 gap-y-10 gap-x-6 md:grid-cols-12 xl:gap-x-8'>
          
          {/* Columna izquierda: texto + mapa */}
          <div className='md:col-span-7 flex flex-col items-center text-center md:items-start md:text-left'>
            <div className='m-5 sm:m-10 lg:ml-32 lg:mt-20 lg:mb-20 w-full md:w-auto'>
              <p className='text-lg font-normal text-white mb-3 tracking-widest'>
                UBICACIÓN
              </p>
              <h2 className='text-white mb-8'>
                Encuéntranos en Google Maps
              </h2>

              <div className='rounded-2xl overflow-hidden shadow-lg w-full max-w-[500px]'>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.84956925946!2d-68.84290660652185!3d18.372117567645276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea8ab1f018a3b9b%3A0x54e6342b2b4eae99!2sNavegantes%20Resto%20Bar!5e0!3m2!1ses-419!2sdo!4v1759330489569!5m2!1ses-419!2sdo"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Columna derecha con imágenes decorativas */}
          <div className='md:col-span-5 relative hidden md:block'>
            <div>
              <Image
                src={'/images/Newsletter/hamburger.webp'}
                alt='soup-image'
                width={626}
                height={602}
                className='-mt-24'
              />
            </div>
            <div className='absolute top-[78%]'>
              <Image
                src={'/images/Newsletter/onions.webp'}
                alt='onion-image'
                width={300}
                height={122}
              />
            </div>
            <div className='absolute top-[30%] right-[-23%]'>
              <Image
                src={'/images/Newsletter/lec.webp'}
                alt='lettuce-image'
                width={300}
                height={122}
              />
            </div>
            <div className='absolute bottom-[10%] left-[0%]'>
              <Image
                src={'/images/Newsletter/yellow.svg'}
                alt='yellow-image'
                width={59}
                height={59}
              />
            </div>
            <div className='absolute bottom-[20%] right-[20%]'>
              <Image
                src={'/images/Newsletter/blue.svg'}
                alt='blue-image'
                width={25}
                height={25}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
