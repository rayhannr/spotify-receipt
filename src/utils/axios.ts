import axios, { AxiosResponse } from 'axios'
import { API_BASE_URL } from '@/constants/url'
import { store, tokenAtom } from '@/store'
import { refreshToken } from './auth'
import { removeSession } from './session'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []
let refreshTimer: NodeJS.Timeout | null = null

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

const REFRESH_INTERVAL = 500

// Function to process the queue after refreshing the token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
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

      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true

      if (!refreshTimer) {
        refreshTimer = setTimeout(async () => {
          try {
            const token = store.get(tokenAtom)?.refresh_token
            const newToken = await refreshToken(token || '')
            processQueue(null, newToken)
            isRefreshing = false
            refreshTimer = null

            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          } catch (refreshError) {
            processQueue(refreshError, null)
            removeSession()
            isRefreshing = false
            refreshTimer = null
            return Promise.reject(refreshError)
          }
        }, REFRESH_INTERVAL)
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
    }

    return Promise.reject(error)
  }
)
