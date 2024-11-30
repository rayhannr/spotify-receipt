import { useAtom } from 'jotai'
import { limitAtom, metricAtom, timeRangeAtom, useIsArtistOrTrack } from '@/store'
import { LIMIT_OPTIONS, METRIC_OPTIONS, Metrics, TIME_RANGE_OPTIONS } from '@/constants/receipt'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { AlbumSelector } from './AlbumSelector'

export const ReceiptGenerator = () => {
  const [metric, setMetric] = useAtom(metricAtom)
  const [timeRange, setTimeRange] = useAtom(timeRangeAtom)
  const [limit, setLimit] = useAtom(limitAtom)

  const isArtistOrTrack = useIsArtistOrTrack()
  const isAlbum = metric === Metrics.album

  return (
    <AccordionItem value="customize">
      <AccordionTrigger>Customize Receipt</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4">
        <div>
          <label>Metrics</label>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isAlbum && (
          <div>
            <label>Time Range</label>
            <Tabs value={timeRange} onValueChange={setTimeRange} orientation="vertical">
              <TabsList className="grid grid-cols-3">
                {TIME_RANGE_OPTIONS.map((option) => (
                  <TabsTrigger value={option.value} key={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {isArtistOrTrack && (
          <div>
            <label className="mt-6">Length</label>
            <Tabs value={limit} onValueChange={setLimit}>
              <TabsList className="grid grid-cols-2">
                {LIMIT_OPTIONS.map((option) => (
                  <TabsTrigger value={option.value} key={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {isAlbum && (
          <div>
            <label className="mt-6">Album</label>
            <AlbumSelector />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
