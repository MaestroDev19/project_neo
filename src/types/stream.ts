export interface Stream {
  id: string;
  platform: 'TWITCH' | 'YOUTUBE';
  externalId: string;
  title: string;
  scheduledStart?: Date;
  startedAt?: Date;
  endedAt?: Date;
  url: string;
  createdAt: Date;
  eventId?: string;
  communityId?: string;
}

export interface WatchParty {
  id: string;
  eventId: string;
  streamId: string;
  hostId: string;
  isActive: boolean;
  currentTime: number;
  isPlaying: boolean;
  participants: WatchPartyParticipant[];
  createdAt: Date;
}

export interface WatchPartyParticipant {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  joinedAt: Date;
  isHost: boolean;
}

export interface StreamChat {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  displayName: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'join' | 'leave' | 'system';
}

export interface EventCapsule {
  id: string;
  eventId: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  highlights: CapsuleHighlight[];
  createdAt: Date;
}

export interface CapsuleHighlight {
  id: string;
  timestamp: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  type: 'moment' | 'clip' | 'screenshot';
}