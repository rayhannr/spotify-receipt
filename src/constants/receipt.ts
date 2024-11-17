export const Metrics = {
  tracks: 'tracks',
  artists: 'artists',
  genres: 'genres',
  stats: 'stats',
}

export const MetricOptions = [
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

export const PeriodOptions = [
  { label: 'Last Month', value: Period.short_term },
  { label: 'Last 6 Months', value: Period.medium_term },
  { label: 'Last Year', value: Period.long_term },
]

export const LimitOptions = [
  { label: 'Top 10', value: '10' },
  { label: 'Top 50', value: '50' },
]
