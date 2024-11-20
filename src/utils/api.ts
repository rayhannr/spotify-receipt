import { Album, Artist, SimplifiedAlbum, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Env } from '@/constants/env'
import { QueryClient, useQuery, UseQueryOptions } from 'react-query'
import CurrentUserEndpoints from 'node_modules/@spotify/web-api-ts-sdk/dist/mjs/endpoints/CurrentUserEndpoints'
import { formatDuration, getAverage, getAverageFeature, getPercentage, getYearDifference, isArtist } from './receipt'
import { FEATURE_ITEMS } from '@/constants/receipt'

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
  link?: string
}

type TopItems = Parameters<CurrentUserEndpoints['topItems']>

export const useTopItems = (params: TopItems, options?: UseQueryOptions<ReceiptData[]>) => {
  const queryFn = async () => {
    const topItems = await sdk.currentUser.topItems(...params)
    const receipts: ReceiptData[] = []

    topItems.items.forEach((item) => {
      receipts.push({
        name: isArtist(item) ? item.name : `${item.name} - ${item.artists.map((artist) => artist.name).join(', ')}`,
        amount: isArtist(item) ? item.popularity.toString() : formatDuration(item.duration_ms),
        link: item.external_urls.spotify,
      })
    })

    return receipts
  }

  return useQuery({
    queryKey: ['topItems', params],
    queryFn,
    ...options,
  })
}

export type TimeRange = TopItems[1]
export const useTopGenres = (timeRange: TimeRange, options?: UseQueryOptions<ReceiptData[]>) => {
  const queryFn = async () => {
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
    queryFn,
    ...options,
  })
}

export const useStats = (timeRange: TimeRange, options?: UseQueryOptions<ReceiptData[]>) => {
  const queryFn = async () => {
    const receipts: ReceiptData[] = []

    const topTracks = await sdk.currentUser.topItems('tracks', timeRange, 50)
    const trackIds = topTracks.items.map((item) => item.id)
    const [audioFeatures, topArtists] = await Promise.allSettled([
      sdk.tracks.audioFeatures(trackIds),
      sdk.currentUser.topItems('artists', timeRange, 50),
    ])

    if (topArtists.status === 'fulfilled') {
      const popularities = topArtists.value.items.map((item) => item.popularity)
      const avgPopularities = getAverage(popularities)

      receipts.push({
        name: 'popularity score',
        amount: avgPopularities,
      })
    }

    const now = new Date()
    const trackAges = topTracks.items.map((item) => getYearDifference(now, new Date(item.album.release_date)))
    const avgTrackAge = getAverage(trackAges)
    receipts.push({
      name: 'average track age',
      amount: `${avgTrackAge} yrs`,
    })

    if (audioFeatures.status === 'fulfilled') {
      const { value } = audioFeatures
      const stats: ReceiptData[] = FEATURE_ITEMS.map(({ key, percent, name, unit }) => {
        const average = getAverageFeature(value, key, percent)
        return { name: name || key, amount: average + (unit ? ` ${unit}` : '') }
      })
      receipts.push(...stats)
    }

    return receipts
  }

  return useQuery({
    queryKey: ['stats', timeRange],
    queryFn,
    ...options,
  })
}

export const useSearchItem = (query: string, options?: UseQueryOptions<SimplifiedAlbum[]>) => {
  const queryFn = async () => {
    const { albums } = await sdk.search(query, ['album'], undefined, 10)
    return albums.items.filter(Boolean)
  }

  return useQuery({
    queryKey: ['albums', query],
    queryFn,
    ...options,
  })
}

export const useAlbum = (id: string, options?: UseQueryOptions<Album>) => {
  const queryFn = () => sdk.albums.get(id)

  return useQuery({
    queryKey: ['album', id],
    queryFn,
    ...options,
  })
}
