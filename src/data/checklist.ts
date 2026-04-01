import type { ChecklistItem, ChecklistCategory, Season } from '../types';

export const checklistItems: ChecklistItem[] = [
  // === 必須 ===
  { id: 'e1', category: 'essential', name: '入場チケット（QR・紙）', description: 'スクショ保存しておくと安心です' },
  { id: 'e2', category: 'essential', name: 'スマホ', description: 'USJ公式アプリを事前に入れておきましょう' },
  { id: 'e3', category: 'essential', name: 'モバイルバッテリー', description: '待ち時間でかなり電池減ります！' },
  { id: 'e4', category: 'essential', name: '財布（現金＋カード）', description: 'システム障害時は現金必須／楽天カードは事前に利用連絡推奨' },
  { id: 'e5', category: 'essential', name: '歩きやすい靴', description: '1日1万歩以上歩きます！' },

  // === 基本 ===
  { id: 'b1', category: 'basic', name: '飲み物', description: '持ち込み本数制限なし（※瓶・缶・アルコールは禁止）' },
  { id: 'b2', category: 'basic', name: 'レインコート', description: 'ジュラシック・パーク・ザ・ライド乗る時は推奨' },
  { id: 'b3', category: 'basic', name: 'ジップロック', description: '食べ残しポップコーンや小物の整理に' },
  { id: 'b4', category: 'basic', name: '酔い止め', description: '酔いやすいアトラクションが多いです' },
  { id: 'b5', category: 'basic', name: 'ウェットティッシュ', description: '食べ歩きで手が汚れた時に必須です' },
  { id: 'b6', category: 'basic', name: 'エコバッグ', description: 'お土産袋は有料なのであると便利' },
  { id: 'b7', category: 'basic', name: 'レジャーシート', description: 'パレード待ちや地蔵スタイルに' },
  { id: 'b8', category: 'basic', name: 'パワーアップバンド', description: '※以前購入したものがあれば忘れずに！' },
  { id: 'b9', category: 'basic', name: '魔法の杖（ハリーポッター）', description: '※持っている場合は忘れずに！' },

  // === 春（3〜5月） ===
  { id: 'sp1', category: 'spring', name: '日焼け止め', description: '春後半から紫外線が強くなります' },
  { id: 'sp2', category: 'spring', name: '薄手の上着', description: '朝晩の温度差が大きいです' },
  { id: 'sp3', category: 'spring', name: '花粉症の薬', description: '花粉シーズンの方は忘れずに' },

  // === 夏（6〜8月）※パレードなどで濡れる場合あり ===
  { id: 'su1', category: 'summer', name: '飲み物', description: 'ペットボトル・水筒OK、何本でもOK ⚠️アルコール・缶瓶・スタバ等のコップは禁止' },
  { id: 'su2', category: 'summer', name: '帽子', description: '熱中症対策に必須です' },
  { id: 'su3', category: 'summer', name: '日焼け止め', description: '日差しが強いのでこまめに塗り直しを' },
  { id: 'su4', category: 'summer', name: '塩分タブレット', description: '熱中症予防に。汗をかいたらこまめに補給' },
  { id: 'su5', category: 'summer', name: '日傘', description: '待ち時間の日差し対策に' },
  { id: 'su6', category: 'summer', name: 'ハンディファン', description: '待ち時間の暑さ対策に' },
  { id: 'su7', category: 'summer', name: 'タオル', description: '汗拭き用に' },
  { id: 'su8', category: 'summer', name: 'バスタオル', description: '水かけイベント後の体拭きに' },
  { id: 'su9', category: 'summer', name: '着替え', description: 'パレードなどで濡れる場合は下着も持っていくと安心' },
  { id: 'su10', category: 'summer', name: 'スリッパ', description: '靴が濡れた時の履き替え用に' },
  { id: 'su11', category: 'summer', name: '荷物を入れる大きな袋', description: '濡れた服や荷物をまとめるのに便利' },
  { id: 'su12', category: 'summer', name: 'カッパ', description: '水かけイベントで濡れたくない場合に' },

  // === 秋（9〜11月）※ハロウィーン期間 ===
  { id: 'au1', category: 'autumn', name: '薄手の上着', description: '朝晩の温度差が大きいです' },
  { id: 'au2', category: 'autumn', name: 'ストール', description: 'ショー待ちの冷え対策に' },
  { id: 'au3', category: 'autumn', name: '⚠️ スリッパはNG', description: 'ハロウィーンで人が多く、足を踏まれたりする場面があるので歩きやすい靴で来てください' },

  // === 冬（12〜2月） ===
  { id: 'w1', category: 'winter', name: 'ネックウォーマー', description: 'マフラーは外す指示が出るため推奨！' },
  { id: 'w2', category: 'winter', name: '手袋', description: '待ち時間のスマホ操作用に' },
  { id: 'w3', category: 'winter', name: '使い捨てカイロ', description: '貼るタイプと貼らないタイプ両方あると最強' },
  { id: 'w4', category: 'winter', name: '脱ぎ着できる上着', description: '屋内は暖かいので調節しやすいものを' },
  { id: 'w5', category: 'winter', name: 'ひざ掛け', description: 'ショー待ちやテラス席を利用する場合' },

  // === 雨・水濡れ ===
  { id: 'r1', category: 'rain', name: 'カバンが入るゴミ袋', description: '水のパレードや雨天時に使用します' },
  { id: 'r2', category: 'rain', name: '替えの靴下', description: '足元が濡れると冷えるので予備を' },
  { id: 'r3', category: 'rain', name: 'ビニール袋', description: '濡れたレインコートなどを入れる用' },
  { id: 'r4', category: 'rain', name: '傘', description: '風が強いので、折り畳み傘だと変形の恐れあり' },
];

export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export function getActiveCategories(season: Season, includeRain: boolean): ChecklistCategory[] {
  const categories: ChecklistCategory[] = ['essential', 'basic', season];
  if (includeRain) categories.push('rain');
  return categories;
}

export const categoryLabels: Record<ChecklistCategory, { label: string; icon: string; color: string }> = {
  essential: { label: '必須', icon: '🔴', color: '#E74C3C' },
  basic: { label: '基本', icon: '🔵', color: '#4A90D9' },
  spring: { label: '春（3〜5月）', icon: '🌸', color: '#F48FB1' },
  summer: { label: '夏（6〜8月）', icon: '☀️', color: '#FF9800' },
  autumn: { label: '秋（9〜11月）', icon: '🍂', color: '#FF7043' },
  winter: { label: '冬（12〜2月）', icon: '❄️', color: '#42A5F5' },
  rain: { label: '雨・水濡れ', icon: '☔', color: '#78909C' },
};
