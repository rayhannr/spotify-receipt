import { Artist, Track } from '@spotify/web-api-ts-sdk'

export const isArtist = (item: Artist | Track): item is Artist => item.type === 'artist'

export const parseDuration = (duration: string): number => {
  const [minutes, seconds] = duration.split(':').map(Number)
  return (minutes * 60 + seconds) * 1000
}

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000)

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const formattedSeconds = seconds.toString().padStart(2, '0')

  return `${minutes}:${formattedSeconds}`
}

export const calculateTotalDuration = (durations: string[]) => {
  const totalMilliseconds = durations.map(parseDuration).reduce((acc, curr) => acc + curr, 0)
  return formatDuration(totalMilliseconds)
}

export const getPercentage = (value: number, total: number) => {
  const percentage = (value / total) * 100
  return `${percentage.toFixed(2)}%`
}
