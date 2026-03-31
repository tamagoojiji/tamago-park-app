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
}

export const heightRestrictions: HeightRestriction[] = [
  // --- 132cm以上 ---
  { name: 'ハリウッド・ドリーム・ザ・ライド', aloneMin: 132, withAdultMin: 132, area: 'ハリウッド', childSwap: true, singleRider: true, image: '' },
  { name: 'ハリウッド・ドリーム・ザ・ライド ～バックドロップ～', aloneMin: 132, withAdultMin: 132, area: 'ハリウッド', childSwap: true, singleRider: false, image: '' },
  { name: 'ザ・フライング・ダイナソー', aloneMin: 132, withAdultMin: 132, area: 'ジュラシック・パーク', childSwap: true, singleRider: true, image: '' },

  // --- 122cm以上（単独） / 付き添いあり条件 ---
  { name: 'スペース・ファンタジー・ザ・ライド', aloneMin: 122, withAdultMin: 102, area: 'ハリウッド', childSwap: true, singleRider: false, image: '' },

  // --- 122cm以上 ---
  { name: 'ハリー・ポッター・アンド・ザ・フォービドゥン・ジャーニー™', aloneMin: 122, withAdultMin: 122, area: 'ウィザーディング・ワールド', childSwap: true, singleRider: true, image: '' },

  // --- 107cm以上（単独） / 付き添いあり条件 ---
  { name: 'アメージング・アドベンチャー・オブ・スパイダーマン・ザ・ライド 4K3D', aloneMin: 122, withAdultMin: 102, area: 'ニューヨーク', childSwap: true, singleRider: true, image: '' },
  { name: 'ジュラシック・パーク・ザ・ライド', aloneMin: 122, withAdultMin: 107, area: 'ジュラシック・パーク', childSwap: true, singleRider: true, image: '' },
  { name: 'ジョーズ', aloneMin: 122, withAdultMin: 0, area: 'アミティ・ビレッジ', childSwap: true, singleRider: true, image: '' },
  { name: 'ミニオン・ハチャメチャ・ライド', aloneMin: 122, withAdultMin: 102, area: 'ミニオン・パーク', childSwap: true, singleRider: true, image: '' },

  // --- 102cm以上 ---
  { name: 'フライト・オブ・ザ・ヒッポグリフ™', aloneMin: 122, withAdultMin: 92, area: 'ウィザーディング・ワールド', childSwap: true, singleRider: false, image: '' },
  { name: 'マリオカート ～クッパの挑戦状～™', aloneMin: 122, withAdultMin: 107, area: 'スーパー・ニンテンドー・ワールド', childSwap: true, singleRider: true, image: '' },
  { name: 'ヨッシー・アドベンチャー™', aloneMin: 122, withAdultMin: 92, area: 'スーパー・ニンテンドー・ワールド', childSwap: true, singleRider: false, image: '' },
  { name: 'ドンキーコングのクレイジー・トロッコ™', aloneMin: 122, withAdultMin: 107, area: 'ドンキーコング・カントリー', childSwap: true, singleRider: false, image: '' },

  // --- ワンダーランド系 ---
  { name: 'エルモのゴーゴー・スケートボード', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: true, image: '' },
  { name: 'エルモのバブル・バブル', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '' },
  { name: 'ビッグバードのビッグトップ・サーカス', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '' },
  { name: 'フライング・スヌーピー', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '' },
  { name: 'ハローキティのカップケーキ・ドリーム', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '' },
  { name: 'ミニオン・ハチャメチャ・アイス', aloneMin: 122, withAdultMin: 92, area: 'ミニオン・パーク', childSwap: true, singleRider: false, image: '' },
  { name: 'モッピーのバルーン・トリップ', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '' },
];
