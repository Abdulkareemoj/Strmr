import { create } from "zustand";
import type { MediaRemoteControl } from "@vidstack/react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  type: "song" | "podcast";
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  albums: Album[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

// Module-level remote control reference – set by PlayerBarContent on mount
let _remote: MediaRemoteControl | null = null;

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;

  playTrack: (track: Track) => void;
  playAlbum: (album: Album, startIndex?: number) => void;
  playPlaylist: (playlist: Playlist, startIndex?: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setQueue: (tracks: Track[]) => void;
  setIsPlaying: (playing: boolean) => void;

  // Remote control bridge
  registerRemote: (remote: MediaRemoteControl) => void;
  togglePlayback: () => void;
  seekTo: (time: number) => void;
  setVolume: (level: number) => void;
  toggleMuted: () => void;

  // Called by PlayerBarContent to sync Vidstack state into the store
  syncPlaybackState: (state: {
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
  }) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,

  playTrack: (track) => {
    set({ currentTrack: track, isPlaying: true });
  },

  playAlbum: (album, startIndex = 0) => {
    set({
      queue: album.tracks,
      currentTrack: album.tracks[startIndex],
      isPlaying: true,
    });
  },

  playPlaylist: (playlist, startIndex = 0) => {
    set({
      queue: playlist.tracks,
      currentTrack: playlist.tracks[startIndex],
      isPlaying: true,
    });
  },

  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index) => {
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index),
    }));
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  nextTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1], isPlaying: true });
    }
  },

  previousTrack: () => {
    const { currentTrack, queue } = get();
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1], isPlaying: true });
    }
  },

  setQueue: (tracks) => {
    set({ queue: tracks });
  },

  setIsPlaying: (playing) => {
    set({ isPlaying: playing });
  },

  registerRemote: (remote) => {
    _remote = remote;
  },

  togglePlayback: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      _remote?.pause();
    } else {
      _remote?.play();
    }
    set({ isPlaying: !isPlaying });
  },

  seekTo: (time) => {
    _remote?.seek(time);
    set({ currentTime: time });
  },

  setVolume: (level) => {
    _remote?.changeVolume(level);
    set({ volume: level, muted: level === 0 });
  },

  toggleMuted: () => {
    _remote?.toggleMuted();
    set((state) => ({ muted: !state.muted }));
  },

  syncPlaybackState: (state) => {
    set(state);
  },
}));
