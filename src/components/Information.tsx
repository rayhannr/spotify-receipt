import { useAtomValue } from 'jotai'
import { AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { metricAtom } from '@/store'
import { Metrics } from '@/constants/receipt'

const stats = [
  {
    title: 'Popularity Score',
    desc: 'The average popularity score of your top 50 artists (0-100).',
  },
  {
    title: 'Average Track Age',
    desc: 'The average age (in years) of your top tracks since their release.',
  },
  {
    title: 'Acousticness',
    desc: 'A confidence measure (0-100) of whether the track is acoustic.',
  },
  {
    title: 'Danceability',
    desc: 'A score (0-100) indicating how danceable a track is, based on elements like tempo, rhythm stability, beat strength, and overall consistency.',
  },
  {
    title: 'Energy',
    desc: 'A 0-100 measure of intensity and activity. High-energy tracks feel fast and loud (e.g., death metal), while low-energy tracks feel calm (e.g., a Bach prelude). Factors include loudness, timbre, dynamic range, onset rate, and entropy.',
  },
  {
    title: 'Happiness',
    desc: "A 0-100 measure of a track's musical positiveness. High valence indicates happy or cheerful tracks, while low valence reflects sad or angry ones.",
  },
  {
    title: 'Instrumentalness',
    desc: 'A 0-1 measure predicting whether a track lacks vocals. "Ooh" and "aah" are considered instrumental, while rap or spoken word is vocal. Values above 0.5 suggest instrumental tracks, with higher confidence as they approach 1.',
  },
  {
    title: 'Liveness',
    desc: 'measures the presence of an audience in a recording. Higher values indicate a greater chance the track is live, with scores above 80 strongly suggesting a live performance.',
  },
  {
    title: 'Loudness',
    desc: 'The overall loudness of a track in decibels (dB), ranging from -60 to 0 dB. This measures the perceived intensity of sound, useful for comparing track volumes.',
  },
  {
    title: 'Speechiness',
    desc: "A (1-100) measure of a track's presence of spoken words. Values close to 100 indicate mostly spoken content (e.g., talk shows, audiobooks), while values between 33 and 66 suggest a mix of music and speech (e.g., rap). Values below 33 are typical for purely musical tracks.",
  },
  {
    title: 'Tempo',
    desc: 'represents the overall speed of a track, measured in beats per minute (BPM). It indicates how fast or slow a piece of music is, based on the average duration between beats.',
  },
]

export const Information = () => {
  const metric = useAtomValue(metricAtom)

  if (metric === Metrics.tracks || metric === Metrics.album) return null

  return (
    <AccordionItem value="info">
      <AccordionTrigger>Information</AccordionTrigger>
      <AccordionContent className="max-h-[340px] pr-2 overflow-y-auto">
        {metric === Metrics.artists && (
          <>
            <strong>AMT</strong> — The popularity of the artist. The value will be between 0 and 100, with 100 being the most
            popular. The artist's popularity is calculated from the popularity of all the artist's tracks.
          </>
        )}

        {metric === Metrics.genres && (
          <>
            <strong>AMT</strong> — The % of your top artists within a specific genre. For example, 25% means 1 in 4 of your top
            artists belong to that genre. An artist may belong to multiple genres.
          </>
        )}

        {metric === Metrics.stats && (
          <div className="flex flex-col gap-3">
            {stats.map((stat) => (
              <p key={stat.title}>
                <strong>{stat.title}</strong> — {stat.desc}
              </p>
            ))}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
