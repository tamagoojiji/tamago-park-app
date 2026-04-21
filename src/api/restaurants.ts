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

export interface MenuItem {
  id: number;
  store_name: string;
  category: 'restaurant' | 'food';
  menu_name: string;
  price: number | null;
  is_discontinued: number;
  last_updated: string;
}

export interface StoreMenusResponse {
  store_name: string;
  menus: MenuItem[];
  count: number;
}

export async function fetchStoreMenus(storeName: string): Promise<StoreMenusResponse> {
  const res = await fetch(`${AUTH_BASE}/menus/${encodeURIComponent(storeName)}`);
  if (!res.ok) {
    throw new Error(`Store Menus API Error: ${res.status}`);
  }
  return res.json();
}
