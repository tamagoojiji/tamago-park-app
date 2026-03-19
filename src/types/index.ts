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
export type CalendarTab = 'hours' | 'annual-pass' | 'events' | 'tickets' | 'crowd' | 'private';

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
  email: string;
  pin?: string;
  createdAt: string;
}

// API設定
export interface ApiConfig {
  baseUrl: string;
}
