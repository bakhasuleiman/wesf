import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/src/lib/github/services/UserService'
import { GitHubDatabase } from '@/src/lib/github/database'
import { verify } from 'jsonwebtoken'

const db = new GitHubDatabase()
const userService = new UserService(db)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth) return NextResponse.json({ success: false, error: 'Нет токена' }, { status: 401 })
    const token = auth.replace('Bearer ', '')
    const payload = verify(token, JWT_SECRET) as any
    const user = await userService.getUserById(payload.userId)
    if (!user) return NextResponse.json({ success: false, error: 'Пользователь не найден' }, { status: 404 })
    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ошибка авторизации' }, { status: 401 })
  }
} 