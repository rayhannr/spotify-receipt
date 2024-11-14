import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/constants/url'
import { store, tokenAtom } from '@/store'
import { refreshToken } from './auth'
import { removeSession } from './session'

interface QueuedRequest {
  resolve: (value?: Promise<AxiosResponse<any>>) => void
  reject: (reason?: any) => void
  config: InternalAxiosRequestConfig
}

let isRefreshing = false
let failedQueue: QueuedRequest[] = []
let refreshTimer: NodeJS.Timeout | null = null
const REFRESH_INTERVAL = 1000

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

// Function to process the queue after refreshing the token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      resolve(apiClient(config))
    } else {
      reject(error)
    }
  })
  failedQueue = []
}

apiClient.interceptors.request.use((config) => {
  const token = store.get(tokenAtom)?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest })

        if (!isRefreshing && !refreshTimer) {
          refreshTimer = setTimeout(async () => {
            isRefreshing = true
            refreshTimer = null

            try {
              const token = store.get(tokenAtom)?.refresh_token
              const newToken = await refreshToken(token || '')
              processQueue(null, newToken)
            } catch (refreshError) {
              processQueue(refreshError, null)
              removeSession()
            } finally {
              isRefreshing = false
            }
          }, REFRESH_INTERVAL)
        }
      })
    }

    return Promise.reject(error)
  }
)
