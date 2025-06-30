'use client'

import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
          Страница не найдена
        </h2>
        <p className="text-neutral-600 mb-8">
          Извините, но страница, которую вы ищете, не существует или была перемещена.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
} 