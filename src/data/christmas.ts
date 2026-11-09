// 2026 ユニバーサル・ホリデー・ワンダーズ（クリスマス）期間の判定と静的データ
import { localDateString } from './halloween';

export const CHRISTMAS_PERIOD = { start: '2026-11-13', end: '2027-01-17' };

// クリスマス仕様の見た目に切り替える開始日（パーク開催初日11/13より前倒しで告知用。終了は CHRISTMAS_PERIOD.end）
export const UI_START_DATE = '2026-11-12';

// カレンダーに🎄マークを付ける日
export const CHRISTMAS_HOLIDAYS: string[] = ['2026-12-24', '2026-12-25'];

// YYYY-MM-DD がクリスマス期間内か
export function isChristmasDate(dateStr: string): boolean {
  return dateStr >= CHRISTMAS_PERIOD.start && dateStr <= CHRISTMAS_PERIOD.end;
}

// 端末ローカル日付でクリスマス仕様を表示する期間か（UI_START_DATE 〜 CHRISTMAS_PERIOD.end）
export function isChristmasPeriodNow(): boolean {
  const today = localDateString();
  return today >= UI_START_DATE && today <= CHRISTMAS_PERIOD.end;
}

// パーク側の開催が始まっているか（バナー文言用）
export function isChristmasStarted(): boolean {
  return localDateString() >= CHRISTMAS_PERIOD.start;
}
