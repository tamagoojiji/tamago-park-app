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

export interface RestaurantHoursDay {
  date: string;
  open_time: string | null;
  close_time: string | null;
}

export async function fetchRestaurantHoursWeek(name: string): Promise<RestaurantHoursDay[]> {
  const res = await fetch(`${AUTH_BASE}/restaurants/hours-week?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Restaurant hours week API Error: ${res.status}`);
  const data = await res.json();
  return data.days;
}

// === 食べ歩きフード（tabearuki_menus） ===

export interface Shop {
  id: number;
  canonical_name: string;
  short_name: string | null;
  aliases: string[];
  area: string;
  category: string;
  map_x: number | null;
  map_y: number | null;
}

export async function setShopCoordinates(shopId: number, mapX: number | null, mapY: number | null, apiKey: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/shops/${shopId}/coordinates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ map_x: mapX, map_y: mapY, api_key: apiKey }),
  });
  if (!res.ok) throw new Error(`Set coordinates failed: ${res.status}`);
}

// === レストラン座標（食べ歩きとは別マップ） ===

export interface RestaurantLocation {
  restaurant_name: string;
  map_x: number | null;
  map_y: number | null;
}

export async function fetchRestaurantLocations(): Promise<RestaurantLocation[]> {
  const res = await fetch(`${AUTH_BASE}/restaurants/locations`);
  if (!res.ok) throw new Error(`Restaurant locations API Error: ${res.status}`);
  const data = await res.json();
  return data.locations;
}

export async function setRestaurantCoordinates(name: string, mapX: number | null, mapY: number | null, apiKey: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/restaurants/${encodeURIComponent(name)}/coordinates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ map_x: mapX, map_y: mapY, api_key: apiKey }),
  });
  if (!res.ok) throw new Error(`Set restaurant coordinates failed: ${res.status}`);
}

export interface TabearukiMenu {
  id: number;
  shop_ids: number[];
  menu_name: string;
  price: number | null;
  genre: string;
  description: string | null;
  sale_start: string | null;
  sale_end: string | null;
  tags: string[];
  suspended: boolean;
  sort_order: number;
  app_visible: boolean;
}

export async function fetchShops(): Promise<Shop[]> {
  const res = await fetch(`${AUTH_BASE}/shops`);
  if (!res.ok) throw new Error(`Shops API Error: ${res.status}`);
  const data = await res.json();
  return data.shops;
}

export async function fetchTabearukiMenus(): Promise<TabearukiMenu[]> {
  const res = await fetch(`${AUTH_BASE}/tabearuki/menus`);
  if (!res.ok) throw new Error(`Tabearuki Menus API Error: ${res.status}`);
  const data = await res.json();
  return data.menus;
}
