import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { MaxInt } from '@spotify/web-api-ts-sdk'
import { MetricOptions, Metrics, PeriodOptions } from '@/constants/receipt'
import { limitAtom, metricAtom, periodAtom, useIsArtistOrTrack, userAtom } from '@/store'
import { TimeRange, useTopGenres, useTopItems } from '@/utils/api'
import { getRandomNumber, getTotalDuration } from '@/utils/receipt'
import receiptBg from '@/assets/receipt.webp'
import barcode from '@/assets/barcode.svg'
import { Env } from '@/constants/env'

export const ReceiptImage = () => {
  const user = useAtomValue(userAtom)
  const metric = useAtomValue(metricAtom)
  const period = useAtomValue(periodAtom)
  const limit = useAtomValue(limitAtom)
  const isArtistOrTrack = useIsArtistOrTrack()

  const metricLabel = MetricOptions.find((option) => option.value === metric)?.label
  const periodLabel = PeriodOptions.find((option) => option.value === period)?.label

  const topItems = useTopItems([metric === Metrics.tracks ? 'tracks' : 'artists', period as TimeRange, +limit as MaxInt<50>], {
    enabled: isArtistOrTrack,
  })
  const topGenres = useTopGenres(period as TimeRange, { enabled: metric === Metrics.genres })

  const receiptItems = useMemo(() => {
    if (isArtistOrTrack) return topItems.data
    return topGenres.data
  }, [topItems.data, topGenres.data])
  const date = useMemo(() => new Date(), [receiptItems])

  const getTotal = () => {
    if (!receiptItems) return 0

    switch (metric) {
      case Metrics.tracks:
        return getTotalDuration(receiptItems.map((item) => item.amount))
      default:
        return receiptItems.reduce((acc, curr) => acc + +curr.amount, 0)
    }
  }

  return (
    <div
      style={{ backgroundImage: `url(${receiptBg})`, backgroundSize: 'cover' }}
      className="w-full max-w-[340px] px-5 py-6 text-neutral-700 font-receipt uppercase text-lg"
    >
      <div className="text-center mb-2">
        <p className="font-semibold text-3xl leading-4">Spoticeipt</p>
        <p>
          {metricLabel} - {periodLabel}
        </p>
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
            <td className="w-4/5 pl-0">item description</td>
            <td className="w-1/5 text-right pr-0">amt</td>
          </tr>
        </thead>
        <tbody>
          {receiptItems?.map((item) => (
            <tr key={item.name} className="leading-4">
              <td className="w-4/5 pl-0">
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
              </td>
              <td className="w-1/5 text-right pr-0">{item.amount}</td>
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
        <p>cardholder: {user?.display_name}</p>
      </div>
      <div className="flex items-center flex-col">
        <img src={barcode} className="w-64" />
        <p>{Env.redirectUri?.replace(/^https?:\/\//, '')}</p>
      </div>
    </div>
  )
}
