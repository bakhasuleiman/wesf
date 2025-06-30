import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/src/lib/github/services/UserService'
import { GitHubDatabase } from '@/src/lib/github/database'
import { sign } from 'jsonwebtoken'
import crypto from 'crypto'

const db = new GitHubDatabase()
const userService = new UserService(db)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7669781923:AAE28ue-uOxvPYeKSfNYZmCCUeHsWepsheU'
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

function validateTelegramAuth(data: any, botToken: string) {
  const { hash, ...fields } = data
  const sorted = Object.keys(fields).sort().map(key => `${key}=${fields[key]}`)
  const dataCheckString = sorted.join('\n')
  const secret = crypto.createHash('sha256').update(botToken).digest()
  const hmac = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex')
  return hmac === hash
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, username, first_name, last_name, photo_url, auth_date, hash } = body
    if (!id || !auth_date || !hash) {
      return NextResponse.json({ success: false, error: 'Недостаточно данных' }, { status: 400 })
    }
    // Проверка подписи
    if (!validateTelegramAuth(body, BOT_TOKEN)) {
      return NextResponse.json({ success: false, error: 'Невалидная подпись Telegram' }, { status: 403 })
    }
    // Проверка времени
    if (Date.now() / 1000 - Number(auth_date) > 86400) {
      return NextResponse.json({ success: false, error: 'Срок действия авторизации истёк' }, { status: 403 })
    }
    // Создание/обновление пользователя
    const user = await userService.createOrUpdateUser({
      telegram_id: String(id),
      username,
      first_name,
      last_name,
      photo_url
    })
    // Генерация JWT
    const token = sign({ userId: user.id, telegram_id: user.telegram_id }, JWT_SECRET, { expiresIn: '7d' })
    // Ответ
    return NextResponse.json({ success: true, user, token })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ошибка Telegram авторизации' }, { status: 500 })
  }
} 