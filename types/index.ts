export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  language: 'English' | 'Hindi' | 'Telugu' | 'Tamil' | 'Kannada';
  audioUrl?: string;
  votes: number;
  addedBy: string;
  addedAt: number;
}

export interface Member {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
  avatar?: string;
}

export interface Party {
  id: string;
  code: string;
  title: string;
  city?: string;
  date?: string;
  time?: string;
  hostId: string;
  hostName: string;
  createdAt: number;
  members: Member[];
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
}

export interface CityEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  imageUrl?: string;
  interested: boolean;
}

export interface BuddyMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
