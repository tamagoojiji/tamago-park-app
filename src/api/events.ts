const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ParkEvent {
  id: number;
  date: string;
  end_date: string | null;
  name: string;
  summary: string | null;
  category: 'event' | 'private' | 'other';
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

export function getEventsForDate(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => isEventOnDate(e, date));
}

export function hasEventOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => isEventOnDate(e, date));
}

export function hasPrivateEventOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => isEventOnDate(e, date) && e.category === 'private');
}
