export type Environment = 'local' | 'remote'
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '')
const normalizePrefix = (prefix: string) => {
  const p = prefix.trim()
  if (!p) return ''
  const withLeading = p.startsWith('/') ? p : `/${p}`
  return withLeading.replace(/\/+$/, '')
}

const buildApiBaseUrl = (originRaw: string, prefixRaw: string) => {
  const origin = normalizeOrigin(originRaw)
  const prefix = normalizePrefix(prefixRaw)

  if (!origin) return prefix || ''
  return `${origin}${prefix}`
}

const parseNumber = (raw: unknown, fallback: number) => {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const n = Number(raw)
    if (Number.isFinite(n)) return n
  }
  return fallback
}

const parseLogLevel = (raw: unknown, fallback: LogLevel): LogLevel => {
  if (typeof raw !== 'string') return fallback
  const upper = raw.toUpperCase()
  if (upper === 'DEBUG' || upper === 'INFO' || upper === 'WARN' || upper === 'ERROR') return upper
  return fallback
}

class Settings {
  // environment
  ENVIRONMENT: Environment = 'local'
  LOG_LEVEL: LogLevel = 'DEBUG'

  // API
  API_ORIGIN: string = ''
  API_PREFIX: string = '/api'
  API_BASE_URL: string = '/api'
  API_TIMEOUT_MS: number = 20_000

  // Auth
  AUTH_TOKEN_KEY: string = 'moneycontrol.auth.token'
  GOOGLE_CLIENT_ID: string = ''
}

class LocalSettings extends Settings {
  constructor() {
    super()

    this.ENVIRONMENT = 'local'
    this.LOG_LEVEL = parseLogLevel(import.meta.env.VITE_LOG_LEVEL, 'DEBUG')

    this.API_ORIGIN = (import.meta.env.VITE_API_ORIGIN as string | undefined) ?? ''
    this.API_PREFIX = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? '/api'
    this.API_BASE_URL = buildApiBaseUrl(this.API_ORIGIN, this.API_PREFIX)

    this.API_TIMEOUT_MS = parseNumber(import.meta.env.VITE_API_TIMEOUT_MS, 20_000)

    this.AUTH_TOKEN_KEY =
      (import.meta.env.VITE_AUTH_TOKEN_KEY as string | undefined) ?? 'moneycontrol.auth.token'

    this.GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? ''
  }
}

class RemoteSettings extends Settings {
  constructor() {
    super()

    this.ENVIRONMENT = 'remote'
    this.LOG_LEVEL = parseLogLevel(import.meta.env.VITE_LOG_LEVEL, 'INFO')

    this.API_ORIGIN = (import.meta.env.VITE_API_ORIGIN as string | undefined) ?? ''
    this.API_PREFIX = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? ''
    this.API_BASE_URL = buildApiBaseUrl(this.API_ORIGIN, this.API_PREFIX)

    this.API_TIMEOUT_MS = parseNumber(import.meta.env.VITE_API_TIMEOUT_MS, 20_000)

    this.AUTH_TOKEN_KEY =
      (import.meta.env.VITE_AUTH_TOKEN_KEY as string | undefined) ?? 'moneycontrol.auth.token'

    this.GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? ''
  }
}

const getEnvironment = (): Environment => {
  const raw = import.meta.env.VITE_ENVIRONMENT
  if (typeof raw === 'string') {
    const v = raw.toLowerCase()
    if (v === 'remote') return 'remote'
    if (v === 'local') return 'local'
  }

  return import.meta.env.PROD ? 'remote' : 'local'
}

const getSettings = (): Settings => {
  const env = getEnvironment()
  const settings = env === 'remote' ? new RemoteSettings() : new LocalSettings()

  if (settings.ENVIRONMENT === 'remote' && !settings.API_ORIGIN) {
    // eslint-disable-next-line no-console
    console.warn(
      '[settings] ENV=remote, ale VITE_API_ORIGIN jest puste. API_BASE_URL=',
      settings.API_BASE_URL,
    )
  }

  return settings
}

export const settings = getSettings()
