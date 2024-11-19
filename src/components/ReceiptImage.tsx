import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { MaxInt } from '@spotify/web-api-ts-sdk'
import { METRIC_OPTIONS, Metrics, TIME_RANGE_OPTIONS } from '@/constants/receipt'
import { albumAtom, limitAtom, metricAtom, timeRangeAtom, useIsArtistOrTrack, userAtom } from '@/store'
import { TimeRange, useAlbum, useStats, useTopGenres, useTopItems } from '@/utils/api'
import { formatDuration, getRandomNumber, getTotalDuration, getTotalPercentage } from '@/utils/receipt'
import receiptBg from '@/assets/receipt.webp'
import barcode from '@/assets/barcode.svg'
import { Env } from '@/constants/env'

export const ReceiptImage = () => {
  const user = useAtomValue(userAtom)
  const metric = useAtomValue(metricAtom)
  const timeRange = useAtomValue(timeRangeAtom)
  const limit = useAtomValue(limitAtom)
  const globalAlbum = useAtomValue(albumAtom)

  const isArtistOrTrack = useIsArtistOrTrack()
  const isStat = metric === Metrics.stats
  const isAlbum = metric === Metrics.album

  const metricLabel = METRIC_OPTIONS.find((option) => option.value === metric)?.label
  const timeRangeLabel = TIME_RANGE_OPTIONS.find((option) => option.value === timeRange)?.label

  const topItems = useTopItems(
    [metric === Metrics.tracks ? 'tracks' : 'artists', timeRange as TimeRange, +limit as MaxInt<50>],
    {
      enabled: isArtistOrTrack,
    }
  )
  const topGenres = useTopGenres(timeRange as TimeRange, { enabled: metric === Metrics.genres })
  const stats = useStats(timeRange as TimeRange, { enabled: metric === Metrics.stats })
  const album = useAlbum(globalAlbum, { enabled: !!globalAlbum && metric === Metrics.album })

  const receiptItems = useMemo(() => {
    switch (metric) {
      case Metrics.artists:
      case Metrics.tracks:
        return topItems.data
      case Metrics.genres:
        return topGenres.data
      case Metrics.stats:
        return stats.data
      case Metrics.album:
        return album.data?.tracks.items.map((item) => ({
          name: item.name,
          amount: formatDuration(item.duration_ms),
          link: item.href,
        }))
      default:
        return []
    }
  }, [topItems.data, topGenres.data, stats.data, album.data, metric])
  const date = useMemo(() => {
    const date = new Date()
    const release = album.data?.release_date
    if (!isAlbum || !release) return date

    const releaseDate = new Date(release)
    releaseDate.setHours(date.getHours(), date.getMinutes())
    return releaseDate
  }, [receiptItems, isAlbum, album.data?.release_date])

  const leftColumnClass = twMerge('pl-0', isStat ? 'w-3/5' : 'w-3/4')
  const rightColumnClass = twMerge('text-right pr-0', isStat ? 'w-2/5' : 'w-1/4')

  const getTotal = () => {
    if (!receiptItems) return 0

    const amounts = receiptItems.map((item) => item.amount)
    switch (metric) {
      case Metrics.tracks:
      case Metrics.album:
        return getTotalDuration(amounts)
      case Metrics.genres:
        return getTotalPercentage(amounts)
      default:
        return receiptItems.reduce((acc, curr) => acc + +curr.amount.replace(/[^0-9.,]/g, ''), 0).toFixed(2)
    }
  }

  return (
    <div
      style={{ backgroundImage: `url(${receiptBg})`, backgroundSize: 'cover' }}
      className="w-full max-w-[340px] px-5 py-6 text-neutral-700 font-receipt uppercase text-lg"
    >
      <div className="text-center mb-2">
        <p className="font-semibold text-3xl leading-6">{(isAlbum && album.data?.name) || 'Spoticeipt'}</p>
        <p>{isAlbum ? album.data?.artists.map((artist) => artist.name).join(', ') : `${metricLabel} - ${timeRangeLabel}`}</p>
      </div>
      <div className="border-dashed border-y-2 border-neutral-700">
        <div className="flex justify-between leading-5">
          <p>
            Date:{' '}
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p>reg # {getRandomNumber(9).toString().padStart(2, '0')}</p>
        </div>
        <div className="flex justify-between leading-5">
          <p>Time: {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: undefined })}</p>
          <p>cshr # {getRandomNumber(100).toString().padStart(2, '0')}</p>
        </div>
      </div>

      <table className="w-full mb-1">
        <thead>
          <tr className="text-neutral-900 leading-5">
            <td className={leftColumnClass}>item description</td>
            <td className={rightColumnClass}>amt</td>
          </tr>
        </thead>
        <tbody>
          {receiptItems?.map((item) => (
            <tr key={item.name} className="leading-4">
              <td className={twMerge(leftColumnClass, 'pb-1')}>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
              </td>
              <td className={rightColumnClass}>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-dashed border-y-2 border-neutral-700 text-xl">
        <div className="flex justify-between leading-5">
          <p>item count</p>
          <p>{receiptItems?.length}</p>
        </div>
        <div className="flex justify-between leading-5 text-neutral-900">
          <p>total</p>
          <p>{getTotal()}</p>
        </div>
      </div>

      <div className="leading-4 mt-1 mb-2">
        <p>card #: **** **** **** {date.getFullYear()}</p>
        <p>auth code: {getRandomNumber(999999)}</p>
        <p>cardholder: {isAlbum ? album.data?.label : user?.display_name}</p>
      </div>
      <div className="flex items-center flex-col">
        <img src={barcode} className="w-64" />
        <p>{Env.redirectUri?.replace(/^https?:\/\//, '')}</p>
      </div>
    </div>
  )
}
