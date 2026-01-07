import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { clearTokenStorage, getTokenFromStorage } from '@/authentication/handleToken'
import { settings } from '@/config/settings'
import { ApiError } from './ApiError'

type Params = Record<string, unknown>
type FormLike = Record<string, string | number | boolean | null | undefined>

type ApiErrorPayload = {
  message?: string
  code?: string | number
  detail?: unknown
}

export class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: settings.API_BASE_URL,
      timeout: settings.API_TIMEOUT_MS,
      headers: { 'Content-Type': 'application/json' },
    })

    this.client.interceptors.request.use((config) => {
      const token = getTokenFromStorage()
      if (token?.access_token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token.access_token}`
      }
      return config
    })

    this.client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (settings.LOG_LEVEL === 'DEBUG') {
          // eslint-disable-next-line no-console
          console.error('API Error:', err)
        }
        const apiError = this.handleError(err)

        if (apiError.status === 401) {
          clearTokenStorage()
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }

        throw apiError
      },
    )
  }

  async get<T>(endpoint: string, queryParams?: Params, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(endpoint, { ...config, params: queryParams })
    return res.data
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    queryParams?: Params,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.post<T>(endpoint, data, { ...config, params: queryParams })
    return res.data
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    queryParams?: Params,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.put<T>(endpoint, data, { ...config, params: queryParams })
    return res.data
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    queryParams?: Params,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.patch<T>(endpoint, data, { ...config, params: queryParams })
    return res.data
  }

  async delete<T>(endpoint: string, queryParams?: Params, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(endpoint, { ...config, params: queryParams })
    return res.data
  }

  async download<T extends Blob>(
    endpoint: string,
    queryParams?: Params,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.get<T>(endpoint, {
      ...config,
      params: queryParams,
      responseType: 'blob',
    })
    return res.data
  }

  async postForm<T>(
    endpoint: string,
    data: FormLike,
    queryParams?: Params,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const body = new URLSearchParams()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) body.append(k, String(v))
    })

    const res = await this.client.post<T>(endpoint, body, {
      ...config,
      params: queryParams,
      headers: {
        ...(config?.headers ?? {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return res.data
  }

  async postMultipart<T>(
    endpoint: string,
    formData: FormData,
    queryParams?: Params,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.client.post<T>(endpoint, formData, {
      ...config,
      params: queryParams,
      headers: {
        ...(config?.headers ?? {}),
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  }

  private handleError(error: unknown): ApiError {
    if (this.isAxiosError<ApiErrorPayload>(error)) {
      const ax = error
      const status = ax.response?.status
      const data = ax.response?.data

      const code = data?.code

      // FastAPI: zwykle "detail"
      const detail = data?.detail

      const message =
        (typeof data?.message === 'string' && data.message) ||
        (typeof detail === 'string' && detail) ||
        (Array.isArray(detail) && 'Validation error') ||
        ax.message ||
        'Request failed'

      return new ApiError(message, { status, code, details: data, cause: error })
    }

    if (error instanceof Error) {
      return new ApiError(error.message, { cause: error })
    }

    return new ApiError('Unexpected error', { cause: error })
  }

  private isAxiosError<T = unknown>(err: unknown): err is AxiosError<T> {
    return (err as AxiosError<T>)?.isAxiosError === true
  }
}
