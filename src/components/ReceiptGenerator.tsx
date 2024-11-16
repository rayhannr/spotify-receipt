import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

const MetricOptions = [
  { label: 'Top Tracks', value: 'tracks' },
  { label: 'Top Artists', value: 'artists' },
  { label: 'Top Genres', value: 'genres' },
  { label: 'Stats', value: 'stats' },
]

const PeriodOptions = [
  { label: 'Last Month', value: 'short_term' },
  { label: 'Last 6 Months', value: 'medium_term' },
  { label: 'Last Year', value: 'long_term' },
]

const LimitOptions = [
  { label: 'Top 10', value: '10' },
  { label: 'Top 50', value: '50' },
]

export const ReceiptGenerator = () => {
  const [metric, setMetric] = useState(MetricOptions[0].value)
  const [period, setPeriod] = useState(PeriodOptions[0].value)
  const [limit, setLimit] = useState(LimitOptions[0].value)

  return (
    <div className="w-full lg:w-5/12 mt-4">
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
      </Select>
    </div>
  )
}
