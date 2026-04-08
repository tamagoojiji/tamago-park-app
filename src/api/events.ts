const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ParkEvent {
  id: number;
  date: string;
  end_date: string | null;
  name: string;
  summary: string | null;
  category: 'event' | 'private' | 'other';
  sub_category: 'event' | 'attraction' | 'show';
  official_url: string | null;
  location: string | null;
  duration: string | null;
  age_restriction: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface EventsResponse {
  events: ParkEvent[];
  count: number;
}

let cachedEvents: ParkEvent[] | null = null;
let fetchPromise: Promise<ParkEvent[]> | null = null;

export async function fetchEvents(dateFrom?: string, dateTo?: string): Promise<ParkEvent[]> {
  const params = new URLSearchParams();
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
  const qs = params.toString();
  const url = `${AUTH_BASE}/events${qs ? `?${qs}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Events API Error: ${res.status}`);
  const data: EventsResponse = await res.json();
  return data.events;
}

export async function fetchAllEvents(): Promise<ParkEvent[]> {
  if (cachedEvents) return cachedEvents;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetchEvents()
    .then(events => {
      cachedEvents = events;
      return events;
    })
    .catch(err => {
      console.error('Failed to load events:', err);
      fetchPromise = null;
      return [];
    });

  return fetchPromise;
}

// イベントが指定日に該当するか（期間対応）
function isEventOnDate(event: ParkEvent, date: string): boolean {
  if (event.end_date) {
    return date >= event.date && date <= event.end_date;
  }
  return event.date === date;
}

// イベントタブ用: 初日または最終日のみ該当
export function isEventStartOrEnd(event: ParkEvent, date: string): boolean {
  if (event.date === date) return true;
  if (event.end_date && event.end_date === date) return true;
  return false;
}

export function getEventsForDate(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => isEventOnDate(e, date));
}

// イベントタブ用: 全種別の初日・最終日のみ
export function getEventStartEndForDate(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => e.category !== 'private' && isEventStartOrEnd(e, date));
}

// カレンダーセル用: イベントタブで表示する日（初日or最終日）
export function hasEventStartOrEndOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => e.category !== 'private' && isEventStartOrEnd(e, date));
}

export function hasEventOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => isEventOnDate(e, date));
}

export function hasPrivateEventOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => isEventOnDate(e, date) && e.category === 'private');
}

// 期間限定イベント（初日・最終日以外）: 期間中で開催中のもの
export function getOngoingLimitedEvents(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e =>
    e.category !== 'private' &&
    e.end_date &&
    date > e.date &&
    date < e.end_date
  );
}

// 単発イベント: end_dateなしでその日に該当
export function getSingleDayEvents(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => !e.end_date && e.date === date && e.category !== 'private');
}

// 期間限定アトラクション: 期間中のもの
export function getLimitedAttractions(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => e.sub_category === 'attraction' && isEventOnDate(e, date));
}

// 期間限定ショー: 期間中のもの
export function getLimitedShows(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => e.sub_category === 'show' && isEventOnDate(e, date));
}
