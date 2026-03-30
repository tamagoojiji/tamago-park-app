const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ShowData {
  name: string;
  times: string[]; // ["09:00", "12:30", ...]
}

export interface ShowsResult {
  shows: ShowData[];
  scheduleDate: string; // "2026-03-30"
  availableDates: string[]; // ["2026-03-30", "2026-03-31", ...]
}

interface ShowsResponse {
  shows: ShowData[];
  count: number;
  scheduleDate: string;
  availableDates: string[];
}

export async function fetchShows(date?: string): Promise<ShowsResult> {
  const url = date
    ? `${AUTH_BASE}/shows?date=${date}`
    : `${AUTH_BASE}/shows`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Shows API Error: ${res.status}`);
  }
  const data: ShowsResponse = await res.json();
  return {
    shows: data.shows,
    scheduleDate: data.scheduleDate,
    availableDates: data.availableDates,
  };
}
