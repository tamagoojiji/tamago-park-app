// 2026 ハロウィーン・ホラー・ナイト期間の判定と静的データ

export const HALLOWEEN_PERIOD = { start: '2026-09-11', end: '2026-11-08' };

// ハロウィーン仕様の見た目に切り替える開始日（パーク開催初日9/11より前倒しで告知用。終了は HALLOWEEN_PERIOD.end）
export const UI_START_DATE = '2026-09-09';

// オールナイト開催日
export const ALL_NIGHT_DATES: string[] = ['2026-09-25'];

// YYYY-MM-DD がハロウィーン期間内か
export function isHalloweenDate(dateStr: string): boolean {
  return dateStr >= HALLOWEEN_PERIOD.start && dateStr <= HALLOWEEN_PERIOD.end;
}

// 端末ローカルの YYYY-MM-DD
export function localDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// 端末ローカル日付でハロウィーン仕様を表示する期間か（UI_START_DATE 〜 HALLOWEEN_PERIOD.end）
export function isHalloweenPeriodNow(): boolean {
  const today = localDateString();
  return today >= UI_START_DATE && today <= HALLOWEEN_PERIOD.end;
}

// ゾンビ出現情報（ハロウィーン攻略ページ）
export const ZOMBIE_INFO =
  '出現 18:00〜21:00 ／ ニューヨーク・サンフランシスコ・アミティ。入園は17時までがおすすめ。夕方からは入場ゲートが混みます。';

// 小さい子連れ向けの注意（ハロウィーン攻略ページ）
export const KIDS_NOTE =
  'ゾンビが出るエリアはハリウッド側から回避。ミニオン・ベロウィーン・グリーティングとスマイリーズ・ハッピー・ハロウィーン・グリーティングは昼の安全枠。';

// オールナイト開催日の配布資料（日付詳細カードで閲覧・ダウンロード）
export type AllNightMaterial = { label: string; src: string; thumb: string; filename: string };
export const ALL_NIGHT_MATERIALS: Record<string, AllNightMaterial[]> = {
  '2026-09-25': [
    { label: 'アトラクションスケジュール', src: '/images/allnight/2026-09-25-attractions.png', thumb: '/images/allnight/2026-09-25-attractions-thumb.jpg', filename: 'ハロウィーン・ホラー・ナイト_オールナイト_アトラクションスケジュール_2026-09-25.png' },
    { label: 'ショースケジュール', src: '/images/allnight/2026-09-25-shows.png', thumb: '/images/allnight/2026-09-25-shows-thumb.jpg', filename: 'ハロウィーン・ホラー・ナイト_オールナイト_ショースケジュール_2026-09-25.png' },
  ],
};
