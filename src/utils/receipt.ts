import { Artist, AudioFeatures, Track } from '@spotify/web-api-ts-sdk'
import { UAParser } from 'ua-parser-js'

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

export const getTotalDuration = (durations: string[]) => {
  const totalMilliseconds = durations.map(parseDuration).reduce((acc, curr) => acc + curr, 0)
  return formatDuration(totalMilliseconds)
}

export const getPercentage = (value: number, total: number) => {
  const percentage = (value / total) * 100
  return `${percentage.toFixed(2)}%`
}

const parsePercentage = (percent: string) => +percent.replace('%', '')

export const getTotalPercentage = (percentages: string[]) => {
  const totalPercentage = percentages.map(parsePercentage).reduce((acc, curr) => acc + curr, 0)
  return totalPercentage.toFixed(2)
}

export const getRandomNumber = (max: number) => Math.floor(Math.random() * max) + 1

export const getYearDifference = (date1: Date, date2: Date) => {
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime())
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25
  return diffInMilliseconds / millisecondsInYear
}

export const getAverage = (values: number[], toFixed = 2) => {
  const average = values.reduce((acc, curr) => acc + curr, 0) / values.length
  return average.toFixed(toFixed)
}

export const getAverageFeature = (features: AudioFeatures[], key: keyof AudioFeatures, percent?: boolean) =>
  getAverage(
    features.map((feature) => (percent ? +feature[key] * 100 : +feature[key])),
    key === 'instrumentalness' ? 6 : 2
  )

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

export const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}
