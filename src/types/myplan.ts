export interface MyPlanAttraction {
  name: string;
  area: string;
  image: string;
  startTime: string;       // "10:30"
  durationMinutes: number; // デフォルト60分、ユーザー調整可
}

export interface MyPlanShow {
  name: string;
  time: string;            // "14:00"
  holdTime?: string;       // 場所取り開始時刻
  holdMinutes: number;
}

export interface MyPlan {
  id?: number;
  date: string;            // "2026-04-18"
  attractions: MyPlanAttraction[];
  shows: MyPlanShow[];
  openTime: string;        // "09:00"
  closeTime: string;       // "21:00"
  memo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const MYPLAN_STEPS = [
  { label: '日付選択', icon: '📅' },
  { label: 'アトラクション選択', icon: '🎢' },
  { label: 'ショー選択', icon: '🎭' },
  { label: 'ショー時間選択', icon: '⏰' },
  { label: 'スケジュール編集', icon: '📋' },
  { label: '確認・保存', icon: '✅' },
] as const;

export const DRAFT_KEY = 'tamago_myplan_draft';
