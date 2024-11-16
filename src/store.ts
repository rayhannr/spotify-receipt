import { createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { AccessToken, UserProfile } from '@spotify/web-api-ts-sdk'

export const store = createStore()

export const StorageKey = {
  token: 'sporeceipt-token',
  user: 'sporeceipt-user',
  verifier: 'spotify-sdk:verifier',
}

export const tokenAtom = atomWithStorage<AccessToken | null>(StorageKey.token, null, undefined, { getOnInit: true })
export const userAtom = atomWithStorage<UserProfile | null>(StorageKey.user, null, undefined, { getOnInit: true })
