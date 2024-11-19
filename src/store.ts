import { atom, createStore, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { UserProfile } from '@spotify/web-api-ts-sdk'
import { LIMIT_OPTIONS, METRIC_OPTIONS, Metrics, TIME_RANGE_OPTIONS } from './constants/receipt'

export const store = createStore()

export const StorageKey = {
  user: 'spoticeipt-user',
  verifier: 'spotify-sdk:verifier',
}

export const userAtom = atomWithStorage<UserProfile | null>(StorageKey.user, null, undefined, { getOnInit: true })

export const metricAtom = atom(METRIC_OPTIONS[0].value)
export const useIsArtistOrTrack = () => {
  const metric = useAtomValue(metricAtom)
  return metric === Metrics.artists || metric === Metrics.tracks
}
export const timeRangeAtom = atom(TIME_RANGE_OPTIONS[0].value)
export const limitAtom = atom(LIMIT_OPTIONS[0].value)
export const queryAtom = atom('')
export const albumAtom = atom('')
