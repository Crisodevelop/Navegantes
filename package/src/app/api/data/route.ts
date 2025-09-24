import { NextResponse } from 'next/server'

import { HeaderItem } from '@/app/types/menu'
import { FeaturesType } from '@/app/types/features'
import { ExpertChiefType } from '@/app/types/expertchief'
import { GalleryImagesType } from '@/app/types/galleryimage'
import { FooterLinkType } from '@/app/types/footerlink'
import { FullMenuType } from '@/app/types/fullmenu'

const HeaderData: HeaderItem[] = [
  { label: 'Sobre nosotros', href: '/#aboutus' },
  { label: 'Menu', href: '/#menu' },
  { label: 'Reservar', href: '/#reservar' },
  // { label: 'Docs', href: '/documentation' },
]

const FeaturesData: FeaturesType[] = [
  {
    imgSrc: '/images/Features/featureOne.svg',
    heading: 'Ambiente Náutico y Acogedor',
    subheading:
      'Un espacio cálido y con estilo para compartir y disfrutar.',
  },
  {
    imgSrc: '/images/Features/featureThree.svg',
    heading: 'Creaciones Exclusivas de Nuestro Chef',
    subheading:
      'Recetas originales creadas por nuestro chef.',
  },
  {
    imgSrc: '/images/Features/featureTwo.svg',
    heading: 'Ingredientes Frescos y Locales',
    subheading:
      'Ingredientes del mar y productos de la zona cada día.',
  },
  {
    imgSrc: '/images/Features/featureFour.svg',
    heading: 'Reservas Rápidas y Sencillas',
    subheading:
      'Agenda online o ven cuando quieras.',
  }
]

const ExpertChiefData: ExpertChiefType[] = [
  {
    profession: 'Co-Fundador, Chef Senior ',
    name: 'Sebastian',
    imgSrc: '/images/Expert/Sebastian.png',
  },
  {
    profession: 'Co-Fundadora, Chef',
    name: 'Marisol',
    imgSrc: '/images/Expert/Marisol.png',
  },
]

const GalleryImagesData: GalleryImagesType[] = [
  {
    src: '/images/Gallery/choripan.webp',
    name: 'Choripan o Chroripopi',
    price: 500,
  },
  {
    src: '/images/Gallery/hamburguesa-argentina.webp',
    name: 'Haburguesa Argentina',
    price: 500,
  },
  {
    src: '/images/Gallery/langosta.webp',
    name: 'Langosta al ajillo con tostones',
    price: 800,
  },
  {
    src: '/images/Gallery/pinchos-de-pollo-con-vegetales.webp',
    name: 'Brochetas de pollo con vegetales',
    price: 550,
  },
]

const FullMenuData: FullMenuType[] = [
  {
    name: 'Grilled Salmon',
    price: '$18.99',
    description: 'Served with lemon butter sauce and grilled vegetables.',
  },
  {
    name: 'Caesar Salad',
    price: '$9.99',
    description: 'Crisp romaine with parmesan, croutons, and Caesar dressing.',
  },
  {
    name: 'Margherita Pizza',
    price: '$13.49',
    description: 'Classic pizza with tomato, mozzarella, and fresh basil.',
  },
  {
    name: 'Tomato Basil Soup',
    price: '$6.99',
    description: 'Creamy tomato soup with a hint of garlic and fresh basil.',
  },
  {
    name: 'Chocolate Lava Cake',
    price: '$7.99',
    description:
      'Warm chocolate cake with a molten center served with vanilla ice cream.',
  },
  {
    name: 'Spaghetti Carbonara',
    price: '$15.25',
    description:
      'Spaghetti tossed with eggs, pancetta, parmesan, and black pepper.',
  },
  {
    name: 'Tiramisu',
    price: '$8.50',
    description:
      'Layered espresso-soaked ladyfingers with mascarpone and cocoa.',
  },
]

const FooterLinkData: FooterLinkType[] = [
  {
    section: 'Menu',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Nosotros', href: '/#aboutus' },
      { label: 'Menu', href: '/#menu' },
      { label: 'Reservar', href: '/#resevar' },
    ],
  },
  {
    section: 'Support',
    links: [
      { label: 'Help/FAQ', href: '/' },
      { label: 'Press', href: '/' },
      { label: 'Affiliates', href: '/' },
      { label: 'Hotel owners', href: '/' },
      { label: 'Partners', href: '/' },
    ],
  },
]

export const GET = () => {
  return NextResponse.json({
    HeaderData,
    FeaturesData,
    ExpertChiefData,
    GalleryImagesData,
    FullMenuData,
    FooterLinkData,
  })
}
