import axios, { AxiosResponse } from 'axios'
import { API_BASE_URL } from '../constants/url'
import { store, tokenAtom, userAtom } from '../store'
import { refreshToken } from './auth'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

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
      if (isRefreshing) {
        // If already refreshing, add the request to the queue
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

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = store.get(tokenAtom)?.refresh_token
        const newToken = await refreshToken(token || '')
        processQueue(null, newToken)
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        store.set(userAtom, null)
        store.set(tokenAtom, null)
        isRefreshing = false
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
