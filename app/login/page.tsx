"use client";
import React, { useEffect } from 'react'

const TELEGRAM_BOT = 'myweb_login_bot' // замените на имя вашего бота
const DOMAIN = 'https://savefood-vqs0.onrender.com'

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

export default function LoginPage() {
  useEffect(() => {
    // Telegram Login Widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?7'
    script.setAttribute('data-telegram-login', TELEGRAM_BOT)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-userpic', 'true')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-userpic', 'true')
    script.setAttribute('data-auth-url', `${DOMAIN}/api/auth/telegram`)
    script.setAttribute('data-callback', 'onTelegramAuth')
    script.async = true
    document.getElementById('telegram-login')?.appendChild(script)
    // Глобальный callback (если нужен)
    window.onTelegramAuth = function(user) {
      // Можно обработать user, например, сохранить токен, редиректить и т.д.
      window.location.href = '/'
    }
  }, [])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Вход через Telegram</h1>
      <div id="telegram-login"></div>
    </div>
  )
} 