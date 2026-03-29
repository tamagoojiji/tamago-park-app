const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ShowData {
  name: string;
  times: string[]; // ["09:00", "12:30", ...]
}

interface ShowsResponse {
  shows: ShowData[];
  count: number;
}

export async function fetchShows(): Promise<ShowData[]> {
  const res = await fetch(`${AUTH_BASE}/shows`);
  if (!res.ok) {
    throw new Error(`Shows API Error: ${res.status}`);
  }
  const data: ShowsResponse = await res.json();
  // 時刻ありのショーのみ返す
  return data.shows.filter(s => s.times.length > 0);
}
