'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { User, AuthState, AuthResponse } from '@/types'
import { UserService } from '../lib/github/services/UserService'
import { GitHubDatabase } from '../lib/github/database'

// Начальное состояние
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null
}

// Типы действий
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }

// Редьюсер для управления состоянием
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload
      }
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

// Интерфейс контекста
interface AuthContextType extends AuthState {
  loginWithTelegram: (telegramData: any) => void
  logout: () => void
  updateUser: (user: User) => void
  clearError: () => void
}

// Создание контекста
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Провайдер контекста
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const db = new GitHubDatabase()
  const userService = new UserService(db)

  // Проверка токена при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Получить userId из токена (можно через API /api/auth/me)
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await response.json()
          if (data.success && data.user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: data.user })
          } else {
            dispatch({ type: 'AUTH_FAILURE', payload: '' })
          }
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: '' })
        }
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Ошибка проверки авторизации' })
      }
    }

    checkAuth()
  }, [])

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('auth_token')
    dispatch({ type: 'AUTH_LOGOUT' })
  }

  // Функция обновления пользователя
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user })
  }

  // Функция очистки ошибки
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Новый метод для Telegram Login
  const loginWithTelegram = async (telegramData: any) => {
    // telegramData: { id, username, first_name, photo_url, auth_date, hash }
    // Отправить данные на сервер для валидации и получения JWT/cookie
    const response = await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramData)
    })
    const data = await response.json()
    if (data.success && data.user && data.token) {
      localStorage.setItem('auth_token', data.token)
      dispatch({ type: 'AUTH_SUCCESS', payload: data.user })
    } else {
      dispatch({ type: 'AUTH_FAILURE', payload: data.error || 'Ошибка Telegram входа' })
    }
  }

  const value: AuthContextType = {
    ...state,
    loginWithTelegram,
    logout,
    updateUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук для использования контекста
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 