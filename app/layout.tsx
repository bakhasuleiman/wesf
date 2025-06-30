import React from 'react'
import type { Metadata } from 'next'
import type { JSX } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/src/contexts/AuthContext'

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
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#22c55e',
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

// Структура корневого layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div className="antialiased">
          <AuthProvider>
            <main className="min-h-screen bg-neutral-50">
              {children}
            </main>
          </AuthProvider>
          
          {/* Глобальные уведомления */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          {/* Скрипты аналитики */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID');
              `,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(YANDEX_METRIKA_ID, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true
                });
              `,
            }}
          />
        </div>
      </body>
    </html>
  )
} 