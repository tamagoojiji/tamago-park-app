const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface CrowdDay {
  date: string;
  day_level: number | null;
  am_level: number | null;
  pm_level: number | null;
  is_manual: boolean;
}

export interface CrowdResponse {
  from: string;
  to: string;
  days: CrowdDay[];
}

export async function fetchCrowd(from: string, to: string): Promise<CrowdResponse> {
  const res = await fetch(`${AUTH_BASE}/crowd?from=${from}&to=${to}`);
  if (!res.ok) throw new Error(`Crowd API Error: ${res.status}`);
  return res.json();
}

export const CROWD_LEVEL_LABEL: Record<number, string> = {
  1: 'やや空き',
  2: '普通',
  3: 'やや混雑',
  4: '混雑',
  5: '超混雑',
};

export const CROWD_LEVEL_COLOR: Record<number, string> = {
  1: '#22c55e',  // 緑
  2: '#9ca3af',  // 灰
  3: '#eab308',  // 黄
  4: '#f97316',  // オレンジ
  5: '#ef4444',  // 赤
};
