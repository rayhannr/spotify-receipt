import { AudioFeatures } from '@spotify/web-api-ts-sdk'

export const Metrics = {
  tracks: 'tracks',
  artists: 'artists',
  genres: 'genres',
  stats: 'stats',
}

export const METRIC_OPTIONS = [
  { label: 'Top Tracks', value: Metrics.tracks },
  { label: 'Top Artists', value: Metrics.artists },
  { label: 'Top Genres', value: Metrics.genres },
  { label: 'Stats', value: Metrics.stats },
]

const Period = {
  short_term: 'short_term',
  medium_term: 'medium_term',
  long_term: 'long_term',
}

export const PERIOD_OPTIONS = [
  { label: 'Last Month', value: Period.short_term },
  { label: 'Last 6 Months', value: Period.medium_term },
  { label: 'Last Year', value: Period.long_term },
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
