import { settings } from '@/config/settings'
import type { Token } from '@/models/token'

export const getTokenFromStorage = (): Token | null => {
  const raw = localStorage.getItem(settings.AUTH_TOKEN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Token
  } catch {
    return null
  }
}

export const setTokenToStorage = (token: Token): void => {
  localStorage.setItem(settings.AUTH_TOKEN_KEY, JSON.stringify(token))
}

export const clearTokenStorage = (): void => {
  localStorage.removeItem(settings.AUTH_TOKEN_KEY)
}
