import Image from 'next/image'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href='/' className='flex items-center gap-2 sm:gap-4'>
      <Image
        src='/images/Logo/logo.svg'
        alt='logo'
        width={117}
        height={34}
        className='w-10 sm:w-fit'
        quality={100}
      />
      <p className='text-black text-base sm:text-xl md:text-2xl font-semibold whitespace-nowrap'>Navegante Resto Bar</p>
    </Link>
  )
}

export default Logo
