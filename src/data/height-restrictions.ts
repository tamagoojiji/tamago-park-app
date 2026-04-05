// USJアトラクション身長制限データ
// aloneMin: 1人で乗れる身長(cm)、withAdultMin: 付き添いありで乗れる身長(cm)
// 0 = 制限なし

export interface HeightRestriction {
  name: string;
  aloneMin: number;
  withAdultMin: number;
  area: string;
  childSwap: boolean;
  singleRider: boolean;
  image: string;
  note?: string; // 身長cm以外の制限（例: 一人で座れたら）
  strollerOk?: boolean; // ベビーカーそのままでOK
}

export const heightRestrictions: HeightRestriction[] = [
  // --- 132cm以上 ---
  { name: 'ハリウッド・ドリーム・ザ・ライド', aloneMin: 132, withAdultMin: 132, area: 'ハリウッド', childSwap: true, singleRider: true, image: '/images/attractions/2.jpg' },
  { name: 'ハリウッド・ドリーム・ザ・ライド ～バックドロップ～', aloneMin: 132, withAdultMin: 132, area: 'ハリウッド', childSwap: true, singleRider: false, image: '/images/attractions/1.jpg' },
  { name: 'ザ・フライング・ダイナソー', aloneMin: 132, withAdultMin: 132, area: 'ジュラシック・パーク', childSwap: true, singleRider: true, image: '/images/attractions/26.jpg' },

  // --- 122cm以上（単独） / 付き添いあり条件 ---
  // 期間限定コラボ: 2026/1/30〜8/17 → 終了後「スペース・ファンタジー・ザ・ライド」に戻す（画像も31.jpgに）
  { name: 'スペース・ファンタジー・ザ・ライド ～CLUB ZEDD REMIX～', aloneMin: 122, withAdultMin: 102, area: 'ハリウッド', childSwap: true, singleRider: true, image: '/images/attractions/44.jpg' },

  // --- 122cm以上 ---
  { name: 'ハリー・ポッター・アンド・ザ・フォービドゥン・ジャーニー™', aloneMin: 122, withAdultMin: 122, area: 'ウィザーディング・ワールド', childSwap: true, singleRider: true, image: '/images/attractions/17.jpg' },

  // --- 107cm以上（単独） / 付き添いあり条件 ---
  { name: 'ジュラシック・パーク・ザ・ライド', aloneMin: 122, withAdultMin: 107, area: 'ジュラシック・パーク', childSwap: true, singleRider: true, image: '/images/attractions/25.jpg' },
  { name: 'ジョーズ', aloneMin: 122, withAdultMin: 0, area: 'アミティ・ビレッジ', childSwap: true, singleRider: true, image: '/images/attractions/19.jpg' },
  { name: 'ミニオン・ハチャメチャ・ライド', aloneMin: 122, withAdultMin: 102, area: 'ミニオン・パーク', childSwap: true, singleRider: true, image: '/images/attractions/28.jpg' },
  { name: 'ミニオン・ハチャメチャ・ミッション ～大悪党への道～', aloneMin: 122, withAdultMin: 0, area: 'ミニオン・パーク', childSwap: false, singleRider: false, image: '/images/attractions/29.jpg', strollerOk: true },

  // --- 102cm以上 ---
  { name: 'フライト・オブ・ザ・ヒッポグリフ™', aloneMin: 122, withAdultMin: 92, area: 'ウィザーディング・ワールド', childSwap: true, singleRider: false, image: '/images/attractions/18.jpg' },
  { name: 'マリオカート ～クッパの挑戦状～™', aloneMin: 122, withAdultMin: 107, area: 'スーパー・ニンテンドー・ワールド', childSwap: true, singleRider: true, image: '/images/attractions/22.jpg' },
  { name: 'ヨッシー・アドベンチャー™', aloneMin: 122, withAdultMin: 92, area: 'スーパー・ニンテンドー・ワールド', childSwap: true, singleRider: false, image: '/images/attractions/21.jpg' },
  { name: 'ドンキーコングのクレイジー・トロッコ™', aloneMin: 122, withAdultMin: 107, area: 'ドンキーコング・カントリー', childSwap: true, singleRider: true, image: '/images/attractions/23.jpg' },

  // --- ワンダーランド系 ---
  { name: 'エルモのゴーゴー・スケートボード', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: true, image: '/images/attractions/11.jpg' },
  { name: 'エルモのバブル・バブル', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/13.jpg' },
  { name: 'ビッグバードのビッグトップ・サーカス', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/10.jpg' },
  { name: 'フライング・スヌーピー', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/5.jpg' },
  { name: 'ハローキティのカップケーキ・ドリーム', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/8.jpg' },
  { name: 'ミニオン・ハチャメチャ・アイス', aloneMin: 122, withAdultMin: 92, area: 'ミニオン・パーク', childSwap: true, singleRider: false, image: '/images/attractions/30.jpg' },
  { name: 'モッピーのバルーン・トリップ', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/12.jpg' },

  // --- 一人で座れたらOK ---
  { name: 'セサミストリート 4-D ムービーマジック™', aloneMin: 0, withAdultMin: 0, area: 'ハリウッド', childSwap: false, singleRider: false, image: '/images/attractions/34.jpg', note: '一人で座れたらOK' },
  { name: 'シュレック 4-D アドベンチャー™', aloneMin: 0, withAdultMin: 0, area: 'ハリウッド', childSwap: false, singleRider: false, image: '/images/attractions/35.jpg', note: '一人で座れたらOK' },
];

// 過去のアトラクション（クローズ済み）
export const closedAttractions: HeightRestriction[] = [
  { name: 'アメージング・アドベンチャー・オブ・スパイダーマン・ザ・ライド 4K3D', aloneMin: 122, withAdultMin: 102, area: 'ニューヨーク', childSwap: true, singleRider: true, image: '' },
];
