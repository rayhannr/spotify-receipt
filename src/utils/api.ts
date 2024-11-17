import { Artist, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Env } from '@/constants/env'
import { QueryClient, useQuery, UseQueryOptions } from 'react-query'
import CurrentUserEndpoints from 'node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/CurrentUserEndpoints'
import { formatDuration, getPercentage, isArtist } from './receipt'

export const scopes = ['user-read-private', 'user-read-email', 'user-top-read']
export const sdk = SpotifyApi.withUserAuthorization(Env.clientId, Env.redirectUri, scopes)

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export interface ReceiptData {
  name: string
  amount: string
}

type TopItems = Parameters<CurrentUserEndpoints['topItems']>

export const useTopItems = (params: TopItems, options?: UseQueryOptions) => {
  const queryFn = () => async () => {
    const topItems = await sdk.currentUser.topItems(...params)
    const receipts: ReceiptData[] = []

    topItems.items.forEach((item) => {
      receipts.push({
        name: item.name,
        amount: isArtist(item) ? item.popularity.toString() : formatDuration(item.duration_ms),
      })
    })

    return receipts
  }

  return useQuery({
    queryKey: ['topItems', params],
    queryFn: queryFn(),
    ...options,
  })
}

export type TimeRange = TopItems[1]
export const useTopGenres = (timeRange: TimeRange, options?: UseQueryOptions) => {
  const queryFn = () => async () => {
    const topGenres = await sdk.currentUser.topItems('artists', timeRange, 50)
    const receipts: ReceiptData[] = []
    const genres: Record<string, number> = {}

    topGenres.items.forEach((item: Artist) => {
      item.genres.forEach((genre) => {
        if (isNaN(genres[genre])) {
          genres[genre] = 1
        } else {
          genres[genre] += 1
        }
      })
    })

    Object.keys(genres).forEach((genre) => {
      receipts.push({
        name: genre,
        amount: String(genres[genre]),
      })
    })

    const sortedReceipts = receipts.sort((a, b) => +b.amount - +a.amount).slice(0, 10)
    return sortedReceipts.map((receipt) => ({
      ...receipt,
      amount: getPercentage(+receipt.amount, topGenres.items.length),
    }))
  }

  return useQuery({
    queryKey: ['topGenres', timeRange],
    queryFn: queryFn(),
    ...options,
  })
}
