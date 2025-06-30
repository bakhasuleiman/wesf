import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'

// Инициализация шрифта Inter
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

// Метаданные для SEO оптимизации
export const metadata: Metadata = {
  title: {
    default: 'FoodSave - Товары со скидками в Узбекистане',
    template: '%s | FoodSave'
  },
  description: 'Найдите товары с большими скидками и продукты с истекающим сроком годности в ближайших магазинах Узбекистана. Экономьте деньги и помогайте бороться с фуд-вэйстом.',
  keywords: [
    'скидки',
    'продукты',
    'Узбекистан',
    'фуд-вэйст',
    'экономия',
    'магазины',
    'срок годности',
    'акции'
  ],
  authors: [{ name: 'FoodSave Team' }],
  creator: 'FoodSave',
  publisher: 'FoodSave',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://foodsave.uz'),
  alternates: {
    canonical: '/',
    languages: {
      'uz': '/uz',
      'ru': '/ru',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://foodsave.uz',
    title: 'FoodSave - Товары со скидками в Узбекистане',
    description: 'Найдите товары с большими скидками и продукты с истекающим сроком годности в ближайших магазинах Узбекистана.',
    siteName: 'FoodSave',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FoodSave - Товары со скидками',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FoodSave - Товары со скидками в Узбекистане',
    description: 'Найдите товары с большими скидками и продукты с истекающим сроком годности в ближайших магазинах Узбекистана.',
    images: ['/og-image.jpg'],
    site: '@foodsave_uz',
    creator: '@foodsave_uz'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
  appleWebApp: {
    capable: true,
    title: 'FoodSave',
    statusBarStyle: 'default'
  }
}

// Конфигурация viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22c55e' },
    { media: '(prefers-color-scheme: dark)', color: '#16a34a' }
  ]
}

// Структура корневого layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
} 