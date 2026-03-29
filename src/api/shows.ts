const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ShowData {
  name: string;
  times: string[]; // ["09:00", "12:30", ...]
}

export interface ShowsResult {
  shows: ShowData[];
  scheduleDate: string; // "2026-03-30"
}

interface ShowsResponse {
  shows: ShowData[];
  count: number;
  scheduleDate: string;
  fetchedAt: string;
}

export async function fetchShows(): Promise<ShowsResult> {
  const res = await fetch(`${AUTH_BASE}/shows`);
  if (!res.ok) {
    throw new Error(`Shows API Error: ${res.status}`);
  }
  const data: ShowsResponse = await res.json();
  return {
    shows: data.shows.filter(s => s.times.length > 0),
    scheduleDate: data.scheduleDate,
  };
}
