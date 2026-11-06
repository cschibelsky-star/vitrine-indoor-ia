export type PlaylistItemType = 'news' | 'event' | 'ad' | 'video' | 'side_ad';

export interface PlaylistItem {
  id: string;
  type: PlaylistItemType;
  title: string;
  description?: string;
  imageIndex?: number;
  duration: number; // segundos
  from?: string;    // HH:mm
  until?: string;   // HH:mm
  enabled?: boolean;
}

export interface PlaylistConfig {
  version: number;
  items: PlaylistItem[];
}

export interface StoryItem {
  tag: string;
  title: string;
  text: string;
  img: string;
}

export interface AdItem {
  title: string;
  text: string;
  img?: string;
}

export interface WidgetData {
  event: string;
  health: string;
  economy: string;
  source: string;
}

export interface TelemetryLogEntry {
  action: string;
  sessionId: string;
  version: string;
  at: string;
  itemId?: string;
  type?: string;
  scheduledMs?: number;
  elapsedMs?: number;
  driftMs?: number;
  reason?: string;
  visible?: boolean;
  [key: string]: unknown;
}

export interface WeatherData {
  temperature: number | null;
  weatherCode: number | null;
  cityName: string;
  updatedAt: number;
  statusText: string;
}
