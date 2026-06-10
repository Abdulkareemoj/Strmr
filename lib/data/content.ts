export const CATEGORIES = [
  "Videos",
  "Shorts",
  "Music",
  "Podcasts",
  "Tutorials",
  "Livestreams",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DURATIONS = ["<5 min", "5-15 min", "15-30 min", "30-60 min", "60+ min"] as const;

export type Duration = (typeof DURATIONS)[number];

export const CONTENT_TYPES = ["Video", "Audio", "Short"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const categoryColor: Record<Category, string> = {
  Videos: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  Shorts: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  Music: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  Podcasts: "border-teal-500/30 bg-teal-500/10 text-teal-400",
  Tutorials: "border-pink-500/30 bg-pink-500/10 text-pink-400",
  Livestreams: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export const durationLabel: Record<Duration, string> = {
  "<5 min": "<5 min",
  "5-15 min": "5-15 min",
  "15-30 min": "15-30 min",
  "30-60 min": "30-60 min",
  "60+ min": "60+ min",
};

export interface Content {
  id: string;
  title: string;
  description: string;
  category: Category;
  duration: number;
  durationLabel: Duration;
  contentType: ContentType;
  author: string;
  views: number;
}

const contentItems: Content[] = [
  {
    id: "1",
    title: "Building a Full-Stack App with Next.js",
    description: "Learn how to build a production-ready full-stack application from scratch using Next.js, Drizzle, and PostgreSQL.",
    category: "Tutorials",
    duration: 28,
    durationLabel: "15-30 min",
    contentType: "Video",
    author: "TechCreator",
    views: 45200,
  },
  {
    id: "2",
    title: "Summer Vibes Music Mix 2026",
    description: "Chill beats and smooth melodies to keep you going through the summer.",
    category: "Music",
    duration: 45,
    durationLabel: "30-60 min",
    contentType: "Audio",
    author: "AudioWave",
    views: 128000,
  },
  {
    id: "3",
    title: "5 CSS Tricks in 60 Seconds",
    description: "Quick CSS tips and tricks you can learn in under a minute.",
    category: "Shorts",
    duration: 1,
    durationLabel: "<5 min",
    contentType: "Short",
    author: "DevShorts",
    views: 89100,
  },
  {
    id: "4",
    title: "Deep Dive: React Server Components",
    description: "Understand how React Server Components work under the hood and when to use them.",
    category: "Tutorials",
    duration: 32,
    durationLabel: "30-60 min",
    contentType: "Video",
    author: "CodeMaster",
    views: 34500,
  },
  {
    id: "5",
    title: "Morning Jazz Playlist",
    description: "Start your day with relaxing jazz melodies and smooth rhythms.",
    category: "Music",
    duration: 60,
    durationLabel: "60+ min",
    contentType: "Audio",
    author: "ChillVibes",
    views: 234000,
  },
  {
    id: "6",
    title: "One Minute Productivity Hacks",
    description: "Quick productivity tips to supercharge your workflow in 60 seconds.",
    category: "Shorts",
    duration: 1,
    durationLabel: "<5 min",
    contentType: "Short",
    author: "QuickLearn",
    views: 67800,
  },
  {
    id: "7",
    title: "The Future of Web Development",
    description: "Industry experts discuss emerging trends shaping the future of web development.",
    category: "Videos",
    duration: 52,
    durationLabel: "60+ min",
    contentType: "Video",
    author: "TechTalks",
    views: 92300,
  },
  {
    id: "8",
    title: "Weekly Tech Podcast: AI Edition",
    description: "This week we discuss the latest developments in AI and machine learning.",
    category: "Podcasts",
    duration: 42,
    durationLabel: "30-60 min",
    contentType: "Audio",
    author: "PodcastHQ",
    views: 56700,
  },
  {
    id: "9",
    title: "Live Coding: Building a CLI Tool",
    description: "Watch as we build a command-line tool from scratch in real-time.",
    category: "Livestreams",
    duration: 120,
    durationLabel: "60+ min",
    contentType: "Video",
    author: "LiveCoder",
    views: 12300,
  },
  {
    id: "10",
    title: "Guitar Tutorial: Learn Your First Song",
    description: "Easy step-by-step guitar tutorial for beginners. Learn your first song today.",
    category: "Tutorials",
    duration: 15,
    durationLabel: "15-30 min",
    contentType: "Video",
    author: "MusicTeacher",
    views: 78900,
  },
  {
    id: "11",
    title: "Hip-Hop Beats for Studying",
    description: "Focus-enhancing hip-hop instrumentals perfect for studying or working.",
    category: "Music",
    duration: 35,
    durationLabel: "30-60 min",
    contentType: "Audio",
    author: "BeatMaker",
    views: 156000,
  },
  {
    id: "12",
    title: "Quick Python Tips in 60 Seconds",
    description: "Speed up your Python development with these quick tips.",
    category: "Shorts",
    duration: 1,
    durationLabel: "<5 min",
    contentType: "Short",
    author: "PyPro",
    views: 102300,
  },
  {
    id: "13",
    title: "Interview with Open Source Maintainers",
    description: "In-depth conversation with maintainers of popular open source projects.",
    category: "Podcasts",
    duration: 55,
    durationLabel: "60+ min",
    contentType: "Audio",
    author: "OSS Voices",
    views: 34100,
  },
  {
    id: "14",
    title: "React Native vs Flutter 2026",
    description: "Comprehensive comparison between React Native and Flutter for mobile development.",
    category: "Videos",
    duration: 22,
    durationLabel: "15-30 min",
    contentType: "Video",
    author: "MobileDev",
    views: 56700,
  },
  {
    id: "15",
    title: "Saturday Night Livestream: Game Dev",
    description: "Join us for a live game development session with community Q&A.",
    category: "Livestreams",
    duration: 180,
    durationLabel: "60+ min",
    contentType: "Video",
    author: "GameDevLive",
    views: 28900,
  },
  {
    id: "16",
    title: "Understanding TypeScript Generics",
    description: "A thorough explanation of TypeScript generics with real-world examples.",
    category: "Tutorials",
    duration: 18,
    durationLabel: "15-30 min",
    contentType: "Video",
    author: "TypeScriptPro",
    views: 41200,
  },
];

export const ALL_CONTENT = contentItems;

export const FEATURED_CONTENT = contentItems.filter((c) =>
  ["1", "2", "3", "7", "11"].includes(c.id),
);
