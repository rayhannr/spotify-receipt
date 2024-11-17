import { useAtom } from 'jotai'
import { limitAtom, metricAtom, periodAtom, useIsArtistOrTrack } from '@/store'
import { LIMIT_OPTIONS, METRIC_OPTIONS, PERIOD_OPTIONS } from '@/constants/receipt'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export const ReceiptGenerator = () => {
  const [metric, setMetric] = useAtom(metricAtom)
  const [period, setPeriod] = useAtom(periodAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const isArtistOrTrack = useIsArtistOrTrack()

  return (
    <Accordion type="single" collapsible defaultValue="customize" className="w-full">
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

          <div>
            <label>Time Period</label>
            <Tabs value={period} onValueChange={setPeriod} orientation="vertical">
              <TabsList className="grid grid-cols-3">
                {PERIOD_OPTIONS.map((option) => (
                  <TabsTrigger value={option.value} key={option.value}>
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
