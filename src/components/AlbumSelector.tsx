import { useState } from 'react'
import { useAtom } from 'jotai'
import { useDebounce } from 'use-debounce'
import { Check } from 'lucide-react'
import { albumAtom } from '@/store'
import { useSearchItem } from '@/utils/api'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command'

export const AlbumSelector = () => {
  const [query, setQuery] = useState('')
  const [album, setAlbum] = useAtom(albumAtom)

  const [debouncedQuery] = useDebounce(query, 1000)
  const albums = useSearchItem(debouncedQuery, { enabled: !!debouncedQuery })
  const albumOptions = albums.data?.map((album) => {
    const label = `${album.name} - ${album.artists.map((artist) => artist.name).join(', ')}`
    return { label, value: album.id }
  })

  return (
    <>
      <input
        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search for an album or track"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {!!debouncedQuery && (
        <Command>
          <CommandList>
            <CommandEmpty>{albums.isFetching ? 'Searching...' : 'No album nor track found'}</CommandEmpty>
            <CommandGroup>
              {albumOptions?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(value) => {
                    setAlbum(value)
                    setQuery('')
                  }}
                >
                  {option.label}
                  <Check className={cn('ml-auto', album === option.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </>
  )
}
