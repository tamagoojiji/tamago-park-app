// ショーテンプレート: 場所取り時間（分）
// 0 = 場所取り不要（グリーティング等）
export const showTemplates: Record<string, { holdMinutes: number }> = {
  'NO LIMIT! パレード ～Discover U!!! バージョン～': { holdMinutes: 90 },
  'アルティメット・ブルース・バッシュ ～音楽の色～': { holdMinutes: 15 },
  'ウィキッド ～オズの魔女たち～': { holdMinutes: 15 },
  'ウォーターワールド': { holdMinutes: 30 },
  'クロミ・ライブ ～ Discover Me Discover U!!! ～': { holdMinutes: 60 },
  'シング・オン・ツアー': { holdMinutes: 20 },
  'ジュラシック・ワールド・ディノ・エンカウンター（草食恐竜）': { holdMinutes: 20 },
  'ジュラシック・ワールド・ベイビー・ディノ・アドベンチャー（赤ちゃん恐竜）': { holdMinutes: 20 },
  'ジュラシック・ワールド・ラプター・アラート（肉食恐竜）': { holdMinutes: 20 },
  'トライウィザード・スピリット・ラリー': { holdMinutes: 15 },
  'パワー・オブ・ロック ～ユー・ロック！～': { holdMinutes: 20 },
  'ヒッポグリフ・マジカル・レッスン': { holdMinutes: 15 },
  'フロッグ・クワイア': { holdMinutes: 15 },
  'プレイング・ウィズおさるのジョージ™': { holdMinutes: 20 },
  'ホグズミード・マジカル・クリーチャーズ・ミート': { holdMinutes: 15 },
  'モッピーのラッキー・ダンス・パーティ': { holdMinutes: 5 },
  'ユニバーサル・モンスター・ライブ・ロックンロール・ショー': { holdMinutes: 30 },
  'ユニバーサル・ワンダーランド ～レッツ・スマイル・トゥギャザー！〜': { holdMinutes: 15 },
};

// 場所取り時間を取得（テンプレにないショーは0分）
export function getHoldMinutes(showName: string): number {
  return showTemplates[showName]?.holdMinutes ?? 0;
}

// OPEN時間ショー判定: endTime を持つ随時運行ショー（オリバンダーの店・フォトオポチュニティ・
// 4Dムービー等、開始〜終了の時間帯で運行するもの）のみ。単発の定時ショー（NO LIMIT! グロウアップ・
// ミニオン BOO-YA 等）は公演が1回でも通常ショー扱い。
// 例外: 公式に終了時刻の掲載がないが実際は開始〜終園まで随時運行のショー（名前の厳密一致）。
const openShowNames: string[] = [
  'ハローキティのリボン・コレクション',
];

export function isOpenShow(show: { name: string; times: string[]; endTime?: string }): boolean {
  return !!show.endTime || openShowNames.includes(show.name);
}

// 2026年夏の夜のイベント: 専用セクションにまとめて最上部表示する対象。
// 季節限定のため、夏が終わったらこの配列を空 [] にすれば全件が通常ショー表示へ戻る（コード削除不要）。
export const summerNightShows: string[] = [
  'サマーナイト・ストリート・アクション',
  'サマービート・スプラッシュ',
  'サマーナイト・バブル・ファンタジー',
  'ハロー！ ネオンサマー・グリーティング',
  'ミニオン BOO-YA ブロックパーティ',
  'NO LIMIT! グロウアップ Oh! マツリ',
  'サマー・グロウ・モーメント',
];

// 夏の夜のイベント判定（名前の厳密一致。部分一致は他ショー誤爆を避けるため使わない）
export function isSummerNightShow(name: string): boolean {
  return summerNightShows.includes(name);
}
