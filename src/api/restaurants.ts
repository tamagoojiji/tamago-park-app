const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface RestaurantInfo {
  restaurant_name: string;
  name_en: string | null;
  open_time: string | null;
  close_time: string | null;
  dining_type: string | null;
}

export interface RestaurantsResponse {
  restaurants: RestaurantInfo[];
  date: string;
  count: number;
}

export async function fetchRestaurants(date: string): Promise<RestaurantsResponse> {
  const res = await fetch(`${AUTH_BASE}/restaurants?date=${date}`);
  if (!res.ok) {
    throw new Error(`Restaurants API Error: ${res.status}`);
  }
  return res.json();
}
