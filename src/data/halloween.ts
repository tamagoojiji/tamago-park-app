// 2026 ハロウィーン・ホラー・ナイト期間の判定と静的データ

export const HALLOWEEN_PERIOD = { start: '2026-09-11', end: '2026-11-08' };

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

// 端末ローカル日付でハロウィーン期間中か
export function isHalloweenPeriodNow(): boolean {
  return isHalloweenDate(localDateString());
}

// ゾンビ出現情報（ハロウィーン攻略ページ）
export const ZOMBIE_INFO =
  '出現 18:00〜21:00 ／ ニューヨーク・サンフランシスコ・アミティ。入園は17時までがおすすめ。夕方からは入場ゲートが混みます。';

// 小さい子連れ向けの注意（ハロウィーン攻略ページ）
export const KIDS_NOTE =
  'ゾンビが出るエリアはハリウッド側から回避。ミニオン・ベロウィーン・グリーティングとスマイリーズ・ハッピー・ハロウィーン・グリーティングは昼の安全枠。';

// 怖さメーター（キーはイベント名と完全一致。定義のあるものだけメーターを表示し、
// 未定義のイベントは名前と期間のみ表示する）
export const SCARE_LEVELS: Record<string, { level: number; note: string }> = {
  '貞子の呪い ～ダーク・ホラー・ライド～': { level: 5, note: 'ガチ勢向け。待ち時間は夜ほど長い' },
  'ファクトリー・オブ・フィアー ～絶望のゾンビ・ツアー～': { level: 4, note: '歩いて進むタイプ' },
  '残像': { level: 4, note: 'ショー枠' },
  'チェンソーマン・ザ・カオス 4-D': { level: 3, note: '座って観るので子連れでも入りやすい' },
  'ストリート・ゾンビ': { level: 4, note: '遠目なら子連れでも' },
  'KATE PRESENTS『18番地の魔女 ～感情と戯れる魔女の館～』': { level: 3, note: '' },
  '『バイオハザード レクイエム』ザ・ダイブ': { level: 4, note: '' },
};
