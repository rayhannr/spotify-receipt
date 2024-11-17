import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Env } from '../constants/env'
import { StorageKey, store, userAtom } from '../store'
import { scopes, sdk } from './api'

export const authorize = () => SpotifyApi.performUserAuthorization(Env.clientId, Env.redirectUri, scopes, async () => {})

export const exchangeToken = async () => {
  const codeVerifier = localStorage.getItem(StorageKey.verifier)
  if (!codeVerifier) return
  await authorize()
  history.pushState({}, '', '/')
}

export const logout = () => {
  sdk.logOut()
  store.set(userAtom, null)
}
