import type { Track, Album, Artist, Playlist } from "./music-player-context"

export const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal",
    duration: 245,
    coverUrl: "/midnight-dreams-album-cover.png",
    audioUrl:
      "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    type: "song",
  },
  {
    id: "2",
    title: "Electric Pulse",
    artist: "Neon Waves",
    album: "Synthwave Collection",
    duration: 198,
    coverUrl: "/album-cover-electric-synthwave.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
    type: "song",
  },
  {
    id: "3",
    title: "Ocean Breeze",
    artist: "Coastal Sounds",
    album: "Serenity",
    duration: 312,
    coverUrl: "/album-cover-ocean-waves.png",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    type: "song",
  },
  {
    id: "4",
    title: "Urban Rhythm",
    artist: "City Beats",
    album: "Metropolitan",
    duration: 223,
    coverUrl: "/album-cover-urban-city.jpg",
    audioUrl:
      "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    type: "song",
  },
  {
    id: "5",
    title: "Starlight Symphony",
    artist: "Cosmic Orchestra",
    album: "Celestial",
    duration: 267,
    coverUrl: "/album-cover-stars-space.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
    type: "song",
  },
  {
    id: "6",
    title: "Tech Talk Episode 42",
    artist: "The Tech Podcast",
    album: "Season 3",
    duration: 3600,
    coverUrl: "/podcast-tech-microphone.jpg",
    audioUrl: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3",
    type: "podcast",
  },
]

export const sampleAlbums: Album[] = [
  {
    id: "1",
    title: "Nocturnal",
    artist: "Luna Eclipse",
    coverUrl: "/midnight-dreams-album-cover.png",
    year: 2024,
    tracks: [sampleTracks[0]],
  },
  {
    id: "2",
    title: "Synthwave Collection",
    artist: "Neon Waves",
    coverUrl: "/album-cover-electric-synthwave.jpg",
    year: 2023,
    tracks: [sampleTracks[1]],
  },
  {
    id: "3",
    title: "Serenity",
    artist: "Coastal Sounds",
    coverUrl: "/album-cover-ocean-waves.png",
    year: 2024,
    tracks: [sampleTracks[2]],
  },
]

export const sampleArtists: Artist[] = [
  {
    id: "1",
    name: "Luna Eclipse",
    imageUrl: "/artist-luna-eclipse.jpg",
    albums: [sampleAlbums[0]],
  },
  {
    id: "2",
    name: "Neon Waves",
    imageUrl: "/artist-neon-waves.jpg",
    albums: [sampleAlbums[1]],
  },
  {
    id: "3",
    name: "Coastal Sounds",
    imageUrl: "/artist-coastal-sounds.jpg",
    albums: [sampleAlbums[2]],
  },
]

export const samplePlaylists: Playlist[] = [
  {
    id: "1",
    title: "Chill Vibes",
    description: "Relaxing music for focus and calm",
    coverUrl: "/playlist-chill-vibes.jpg",
    tracks: [sampleTracks[0], sampleTracks[2], sampleTracks[4]],
  },
  {
    id: "2",
    title: "Workout Mix",
    description: "High energy tracks to power your workout",
    coverUrl: "/playlist-workout-energy.jpg",
    tracks: [sampleTracks[1], sampleTracks[3]],
  },
]
