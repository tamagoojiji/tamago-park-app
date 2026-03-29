// 貸切イベントデータ（動的fetch）
export interface PrivateEvent {
  name: string;
  time: string;
}

// JSONのURL（GitHub Pages）
const DATA_URL = `${import.meta.env.BASE_URL}data/private-events.json`;

// キャッシュ
let cachedEvents: Record<string, PrivateEvent> | null = null;
let fetchPromise: Promise<Record<string, PrivateEvent>> | null = null;

export async function fetchPrivateEvents(): Promise<Record<string, PrivateEvent>> {
  if (cachedEvents) return cachedEvents;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch private events: ${res.status}`);
      return res.json();
    })
    .then(data => {
      cachedEvents = data;
      return data;
    })
    .catch(err => {
      console.error('Failed to load private events:', err);
      fetchPromise = null;
      return {};
    });

  return fetchPromise;
}

// 同期アクセス用（fetch完了後に使う）
export function getPrivateEvents(): Record<string, PrivateEvent> {
  return cachedEvents || {};
}

export function hasPrivateEvent(date: string): boolean {
  return date in getPrivateEvents();
}
