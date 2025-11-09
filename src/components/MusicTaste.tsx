import { useMusicTaste, useTopItems } from '@/utils/api'
import { AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

export const MusicTaste = () => {
  const { data } = useTopItems(['tracks', 'medium_term', 50])
  const topTracks = data?.map((track) => track.name)
  const [type, setType] = useState('compliment')
  const musicTaste = useMusicTaste(topTracks || [], type, { enabled: !!topTracks?.length })

  const renderContent = () => {
    if (musicTaste.error) return <p>Failed to generate your music taste</p>
    if (musicTaste.isFetching) return <p>Generating your music taste...</p>
    return <ReactMarkdown>{musicTaste.data}</ReactMarkdown>
  }

  return (
    <AccordionItem value="taste">
      <AccordionTrigger>Your Music Taste</AccordionTrigger>
      <AccordionContent>
        <p className="text-muted-foreground text-sm">Generated based on your top 50 tracks in the last 6 months</p>
        <Tabs value={type} onValueChange={setType} className="my-3">
          <TabsList className="grid grid-cols-2">
            {['compliment', 'insult'].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {renderContent()}
      </AccordionContent>
    </AccordionItem>
  )
}
