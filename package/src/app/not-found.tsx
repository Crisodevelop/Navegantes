import HeroSub from '@/app/components/SharedComponent/HeroSub'
import NotFound from '@/app/components/NotFound'
import { Metadata } from 'next'
import Header from '@/app/components/Layout/Header'
import Footer from '@/app/components/Layout/Footer'

export const metadata: Metadata = {
  title: '404 Page | Venus ',
}

const ErrorPage = () => {
  return (
    <>
      <Header />
      <HeroSub title='404' />
      <NotFound />
      <Footer />
    </>
  )
}

export default ErrorPage
