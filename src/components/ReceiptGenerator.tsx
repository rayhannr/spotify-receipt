import { useAtom } from 'jotai'
import { limitAtom, metricAtom, useIsArtistOrTrack } from '@/store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { LimitOptions, MetricOptions, PeriodOptions } from '@/constants/receipt'

export const ReceiptGenerator = () => {
  const [metric, setMetric] = useAtom(metricAtom)
  const [period, setPeriod] = useAtom(metricAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const isArtistOrTrack = useIsArtistOrTrack()

  return (
    <Accordion type="single" collapsible defaultValue="customize" className="w-full">
      <AccordionItem value="customize">
        <AccordionTrigger>Customize Receipt</AccordionTrigger>
        <AccordionContent>
          <label>Metrics</label>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="mb-6">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {MetricOptions.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label>Time Period</label>
          <Tabs value={period} onValueChange={setPeriod} orientation="vertical">
            <TabsList className="grid grid-cols-3 mb-6">
              {PeriodOptions.map((option) => (
                <TabsTrigger value={option.value} key={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isArtistOrTrack && (
            <>
              <label>Length</label>
              <Tabs value={limit} onValueChange={setLimit}>
                <TabsList className="grid grid-cols-2">
                  {LimitOptions.map((option) => (
                    <TabsTrigger value={option.value} key={option.value}>
                      {option.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
