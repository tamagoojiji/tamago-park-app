// カレンダー関連
export interface DayInfo {
  date: string; // YYYY-MM-DD
  openTime?: string;
  closeTime?: string;
  weather?: WeatherInfo;
  isToday?: boolean;
  isHoliday?: boolean;
  crowdLevel?: 1 | 2 | 3 | 4 | 5;
}

export interface WeatherInfo {
  icon: string;
  tempMax: number;
  tempMin: number;
  description: string;
}

// タブ情報
export type CalendarTab = 'hours' | 'annual-pass' | 'events' | 'tickets' | 'crowd' | 'private' | 'shows';

// プランニング
export interface PlanItem {
  id: string;
  showName: string;
  time: string;       // "14:00"
  holdTime?: string;   // "13:30"（場所取り開始）
  holdMinutes: number; // 場所取り分数
}

// メニュー項目
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  comingSoon?: boolean;
}

// 認証
export interface User {
  id: number;
  line_uid: string;
  display_name: string | null;
  birthday: string | null;
  gender: string | null;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string | null;
  message?: string | null;
  is_new?: boolean;
}

// チェックリスト
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type ChecklistCategory = 'essential' | 'basic' | 'kids' | 'spring' | 'summer' | 'autumn' | 'winter' | 'rain';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  name: string;
  description: string;
}

// API設定
export interface ApiConfig {
  baseUrl: string;
}
