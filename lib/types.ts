export type Oshi = {
  id: string;
  name: string;
  category: 'idol' | 'anime' | 'actor' | 'vtuber' | 'other';
  color: string;
  imageUrl?: string;
  memo?: string;
  createdAt: number;
};

export type Good = {
  id: string;
  oshiId: string;
  name: string;
  price: number;
  date: string;
  imageUrl?: string;
  memo?: string;
};

export type Event = {
  id: string;
  oshiId: string;
  title: string;
  type: 'live' | 'handshake' | 'movie' | 'online' | 'other';
  date: string;
  price: number;
  attended: boolean;
  memo?: string;
};

export const CATEGORIES: Record<Oshi['category'], string> = {
  idol: 'アイドル',
  anime: 'アニメ',
  actor: '俳優/女優',
  vtuber: 'VTuber',
  other: 'その他',
};

export const EVENT_TYPES: Record<Event['type'], string> = {
  live: 'ライブ',
  handshake: '握手会/接触',
  movie: '映画/舞台',
  online: 'オンライン',
  other: 'その他',
};
