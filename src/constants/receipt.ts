import { AudioFeatures } from '@spotify/web-api-ts-sdk'

export const Metrics = {
  tracks: 'tracks',
  artists: 'artists',
  genres: 'genres',
  stats: 'stats',
  album: 'album',
}

export const METRIC_OPTIONS = [
  { label: 'Top Tracks', value: Metrics.tracks },
  { label: 'Top Artists', value: Metrics.artists },
  { label: 'Top Genres', value: Metrics.genres },
  { label: 'Stats', value: Metrics.stats },
  { label: 'Search Album', value: Metrics.album },
]

const TimeRange = {
  short_term: 'short_term',
  medium_term: 'medium_term',
  long_term: 'long_term',
}

export const TIME_RANGE_OPTIONS = [
  { label: 'Last Month', value: TimeRange.short_term },
  { label: 'Last 6 Months', value: TimeRange.medium_term },
  { label: 'Last Year', value: TimeRange.long_term },
]

export const LIMIT_OPTIONS = [
  { label: 'Top 10', value: '10' },
  { label: 'Top 50', value: '50' },
]

interface Feature {
  key: keyof AudioFeatures
  name?: string
  percent?: boolean
  unit?: string
}

export const FEATURE_ITEMS: Feature[] = [
  { key: 'acousticness', percent: true },
  { key: 'danceability', percent: true },
  { key: 'energy', percent: true },
  { key: 'valence', name: 'happiness', percent: true },
  { key: 'instrumentalness', percent: true },
  { key: 'liveness', percent: true },
  { key: 'loudness' },
  { key: 'speechiness', percent: true },
  { key: 'tempo', unit: 'bpm' },
]
