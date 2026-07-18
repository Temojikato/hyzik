import { Timestamp } from 'firebase/firestore';

export interface PlayerProfile {
  id: string;
  email?: string;
  displayName?: string;
  reyvateilId?: string;
  reyvateilName?: string;
  reyvateilImageUrl?: string;
  level?: number;
  conditions?: Array<string | { name: string; type?: string; amount?: number; color?: string }>;
  stats?: Record<string, number>;
  unlockedCyphers?: string[];
  unlockedRecipes?: string[];
  inventory?: unknown[];
  lastSeenAt?: Timestamp;
}

export interface CypherDefinition {
  id: string;
  number: number;
  title: string;
  domain: string;
  description: string;
  color: string;
}

export interface PublicLexiconEntry {
  id: string;
  headword: string;
  pronunciation: string;
  partOfSpeech: string;
  dialect: string;
  cypherId: string;
}

export interface UnlockedLexiconEntry extends PublicLexiconEntry {
  meaning: string;
  notes?: string;
  audioUrl?: string;
}

export interface SongLine {
  hymmnos: string;
  tokenIds?: string[];
  direction?: string;
}

export interface CampaignSong {
  id: string;
  title: string;
  location?: string;
  youtubeUrl?: string;
  lines: SongLine[];
  updatedAt?: Timestamp;
}

export interface CampaignState {
  currentSongId?: string;
  currentSongTitle?: string;
  youtubeUrl?: string;
  updatedAt?: Timestamp;
}

export type MessageStatus = 'waiting' | 'accepted' | 'read' | 'dismissed';

export interface PrivateMessage {
  id: string;
  groupId: string;
  recipientId: string;
  senderId: string;
  subject?: string;
  body: string;
  status: MessageStatus;
  createdAt?: Timestamp;
  acceptedAt?: Timestamp;
  readAt?: Timestamp;
}
