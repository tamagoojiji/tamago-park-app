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

// === 食べ歩きフード（tabearuki_menus） ===

export interface Shop {
  id: number;
  canonical_name: string;
  short_name: string | null;
  aliases: string[];
  area: string;
  category: string;
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
