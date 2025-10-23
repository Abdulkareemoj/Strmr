"use client"

import type React from "react"

import { createContext, useContext, useState, useRef, type ReactNode } from "react"
import type { MediaPlayerInstance } from "@vidstack/react"

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  audioUrl: string
  type: "song" | "podcast"
}

export interface Album {
  id: string
  title: string
  artist: string
  coverUrl: string
  year: number
  tracks: Track[]
}

export interface Artist {
  id: string
  name: string
  imageUrl: string
  albums: Album[]
}

export interface Playlist {
  id: string
  title: string
  description: string
  coverUrl: string
  tracks: Track[]
}

interface MusicPlayerContextType {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  playerRef: React.RefObject<MediaPlayerInstance>
  playTrack: (track: Track) => void
  playAlbum: (album: Album, startIndex?: number) => void
  playPlaylist: (playlist: Playlist, startIndex?: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  nextTrack: () => void
  previousTrack: () => void
  togglePlay: () => void
  setQueue: (tracks: Track[]) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [queue, setQueueState] = useState<Track[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<MediaPlayerInstance>(null)

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const playAlbum = (album: Album, startIndex = 0) => {
    setQueueState(album.tracks)
    setCurrentTrack(album.tracks[startIndex])
    setIsPlaying(true)
  }

  const playPlaylist = (playlist: Playlist, startIndex = 0) => {
    setQueueState(playlist.tracks)
    setCurrentTrack(playlist.tracks[startIndex])
    setIsPlaying(true)
  }

  const addToQueue = (track: Track) => {
    setQueueState((prev) => [...prev, track])
  }

  const removeFromQueue = (index: number) => {
    setQueueState((prev) => prev.filter((_, i) => i !== index))
  }

  const clearQueue = () => {
    setQueueState([])
  }

  const setQueue = (tracks: Track[]) => {
    setQueueState(tracks)
  }

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
    if (currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1])
      setIsPlaying(true)
    }
  }

  const previousTrack = () => {
    if (!currentTrack || queue.length === 0) return
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id)
    if (currentIndex > 0) {
      setCurrentTrack(queue[currentIndex - 1])
      setIsPlaying(true)
    }
  }

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        queue,
        isPlaying,
        playerRef,
        playTrack,
        playAlbum,
        playPlaylist,
        addToQueue,
        removeFromQueue,
        clearQueue,
        nextTrack,
        previousTrack,
        togglePlay,
        setQueue,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider")
  }
  return context
}
