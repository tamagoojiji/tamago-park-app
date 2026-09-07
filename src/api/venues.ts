const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

// === 会場座標（ステージ・ショー会場・エリア） ===

export interface VenueLocation {
  venue_name: string;
  map_x: number | null;
  map_y: number | null;
}

export async function fetchVenueLocations(): Promise<VenueLocation[]> {
  const res = await fetch(`${AUTH_BASE}/venues/locations`);
  if (!res.ok) throw new Error(`Venue locations API Error: ${res.status}`);
  const data = await res.json();
  return data.locations;
}

export async function setVenueCoordinates(name: string, mapX: number | null, mapY: number | null, apiKey: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/venues/${encodeURIComponent(name)}/coordinates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ map_x: mapX, map_y: mapY, api_key: apiKey }),
  });
  if (!res.ok) throw new Error(`Set venue coordinates failed: ${res.status}`);
}
