import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { useDebounce } from 'use-debounce'
import { Check } from 'lucide-react'
import { albumAtom } from '@/store'
import { useSearchItem } from '@/utils/api'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command'
import { cn } from '@/lib/utils'

export const AlbumSelector = () => {
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState('')
  const [showCommand, setShowCommand] = useState(true)
  const [album, setAlbum] = useAtom(albumAtom)

  const [debouncedQuery] = useDebounce(query, 1000)
  const albums = useSearchItem(debouncedQuery, { enabled: !!debouncedQuery })
  const albumOptions =
    albums.data?.map((album) => {
      const label = `${album.name} - ${album.artists.map((artist) => artist.name).join(', ')}`
      return { label, value: album.id }
    }) || []

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setQuery(value)
    setKeyword(value)
  }

  const onCommandChange = (value: string, label: string) => {
    setAlbum(value)
    setKeyword(label)
    setShowCommand(false)
  }

  useEffect(() => {
    if (!keyword) {
      setShowCommand(false)
      return
    }
    setShowCommand(true)
  }, [albums.isFetching, albums.data])

  return (
    <>
      <input
        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search for an album or track"
        value={keyword}
        onChange={onInputChange}
      />
      {showCommand && (
        <Command>
          <CommandList>
            <CommandEmpty>{albums.isFetching ? 'Searching...' : 'No album nor track found'}</CommandEmpty>
            <CommandGroup>
              {albumOptions.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={(value) => onCommandChange(value, option.label)}>
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
