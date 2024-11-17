import { atom, createStore, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { AccessToken, UserProfile } from '@spotify/web-api-ts-sdk'
import { LimitOptions, MetricOptions, Metrics, PeriodOptions } from './constants/receipt'

export const store = createStore()

export const StorageKey = {
  token: 'sporeceipt-token',
  user: 'sporeceipt-user',
  verifier: 'spotify-sdk:verifier',
}

export const tokenAtom = atomWithStorage<AccessToken | null>(StorageKey.token, null, undefined, { getOnInit: true })
export const userAtom = atomWithStorage<UserProfile | null>(StorageKey.user, null, undefined, { getOnInit: true })

export const metricAtom = atom(MetricOptions[0].value)
export const useIsArtistOrTrack = () => {
  const metric = useAtomValue(metricAtom)
  return metric === Metrics.artists || metric === Metrics.tracks
}
export const periodAtom = atom(PeriodOptions[0].value)
export const limitAtom = atom(LimitOptions[0].value)
