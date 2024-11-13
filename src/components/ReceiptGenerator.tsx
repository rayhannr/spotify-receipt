import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const MetricOptions = [
  { label: 'Top Tracks', value: 'tracks' },
  { label: 'Top Artists', value: 'artists' },
  { label: 'Top Genres', value: 'genres' },
  { label: 'Stats', value: 'stats' },
]

export const ReceiptGenerator = () => {
  const [metric, setMetric] = useState(MetricOptions[0].value)

  return (
    <div className="w-full md:w-1/3 mt-4">
      <label>Metrics</label>
      <Select value={metric} onValueChange={setMetric}>
        <SelectTrigger>
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
    </div>
  )
}
