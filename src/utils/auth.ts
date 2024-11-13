import axios from 'axios'
import { Env } from '../constants/env'
import { AUTH_BASE_URL, ENDPOINTS } from '../constants/url'
import { Token } from '../models'
import { store, tokenAtom } from '../store'

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export const authorize = async () => {
  const authUrl = new URL(AUTH_BASE_URL + ENDPOINTS.auth.authorize())
  const scope = 'user-read-private user-read-email'

  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)

  localStorage.setItem('code_verifier', codeVerifier)

  const params = {
    response_type: 'code',
    client_id: Env.clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: Env.redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString()
  window.location.href = authUrl.toString()
}

const saveToken = async (data: URLSearchParams) => {
  try {
    const result = await axios.post<Token>(ENDPOINTS.auth.getToken(), data, {
      baseURL: AUTH_BASE_URL,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const expiresIn = new Date().getTime() + result.data.expires_in * 1000
    store.set(tokenAtom, { ...result.data, expires_in: expiresIn })
    return result.data.access_token
  } catch (error) {
    throw error
  }
}

export const exchangeToken = async (code: string) => {
  const codeVerifier = localStorage.getItem('code_verifier') || ''

  if (!code) return

  const data = new URLSearchParams({
    client_id: Env.clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: Env.redirectUri,
    code_verifier: codeVerifier,
  })

  await saveToken(data)
  localStorage.removeItem('code_verifier')
  history.pushState({}, '', '/')
}

export const refreshToken = async (token: string) => {
  const data = new URLSearchParams({
    client_id: Env.clientId,
    grant_type: 'refresh_token',
    refresh_token: token,
  })

  const newToken = await saveToken(data)
  return newToken
}
