// ショーテンプレート: 場所取り時間（分）
// 0 = 場所取り不要（グリーティング等）
export const showTemplates: Record<string, { holdMinutes: number }> = {
  'NO LIMIT! パレード ～Discover U!!! バージョン～': { holdMinutes: 90 },
  'アルティメット・ブルース・バッシュ ～音楽の色～': { holdMinutes: 15 },
  'ウィキッド ～オズの魔女たち～': { holdMinutes: 15 },
  'ウォーターワールド': { holdMinutes: 30 },
  'クロミ・ライブ ～ Discover Me Discover U!!! ～': { holdMinutes: 60 },
  'シング・オン・ツアー': { holdMinutes: 20 },
  'ジュラシック・ワールド・ディノ・エンカウンター': { holdMinutes: 20 },
  'ジュラシック・ワールド・ベイビー・ディノ・アドベンチャー': { holdMinutes: 20 },
  'ジュラシック・ワールド・ラプター・アラート': { holdMinutes: 20 },
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
