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
  seasonal?: { replaces: string; start: string; end: string }; // 期間限定コラボ版（期間中のみ表示、期間外はreplacesに戻す）
}

export const heightRestrictions: HeightRestriction[] = [
  // --- 132cm以上 ---
  { name: 'ハリウッド・ドリーム・ザ・ライド', aloneMin: 132, withAdultMin: 132, area: 'ハリウッド', childSwap: true, singleRider: true, image: '/images/attractions/ハリウッド・ドリーム・ザ・ライド.jpg' },
  { name: 'ハリウッド・ドリーム・ザ・ライド ～バックドロップ～', aloneMin: 132, withAdultMin: 132, area: 'ハリウッド', childSwap: true, singleRider: false, image: '/images/attractions/ハリウッド・ドリーム・バックドロップ.jpg' },
  { name: 'ザ・フライング・ダイナソー', aloneMin: 132, withAdultMin: 132, area: 'ジュラシック・パーク', childSwap: true, singleRider: true, image: '/images/attractions/ザ・フライング・ダイナソー.jpg' },

  // --- 122cm以上（単独） / 付き添いあり条件 ---
  { name: 'スペース・ファンタジー・ザ・ライド', aloneMin: 122, withAdultMin: 102, area: 'ハリウッド', childSwap: true, singleRider: true, image: '/images/attractions/スペース・ファンタジー・ザ・ライド.jpg' },
  { name: 'スペース・ファンタジー・ザ・ライド ～CLUB ZEDD REMIX～', aloneMin: 122, withAdultMin: 102, area: 'ハリウッド', childSwap: true, singleRider: true, image: '/images/attractions/スペース・ファンタジー・ザ・ライド.jpg', seasonal: { replaces: 'スペース・ファンタジー・ザ・ライド', start: '2026-01-30', end: '2026-08-17' } },

  // --- 122cm以上 ---
  { name: 'ハリー・ポッター・アンド・ザ・フォービドゥン・ジャーニー™', aloneMin: 122, withAdultMin: 122, area: 'ウィザーディング・ワールド', childSwap: true, singleRider: true, image: '/images/attractions/フォービドゥン・ジャーニー.jpg' },

  // --- 107cm以上（単独） / 付き添いあり条件 ---
  { name: 'ジュラシック・パーク・ザ・ライド', aloneMin: 122, withAdultMin: 107, area: 'ジュラシック・パーク', childSwap: true, singleRider: true, image: '/images/attractions/ジュラシック・パーク・ザ・ライド.jpg' },
  { name: 'ジョーズ', aloneMin: 122, withAdultMin: 0, area: 'アミティ・ビレッジ', childSwap: true, singleRider: true, image: '/images/attractions/ジョーズ.jpg' },
  { name: 'ミニオン・ハチャメチャ・ライド', aloneMin: 122, withAdultMin: 102, area: 'ミニオン・パーク', childSwap: true, singleRider: true, image: '/images/attractions/ミニオン・ハチャメチャ・ライド.jpg' },
  { name: 'ミニオン・ハチャメチャ・ミッション ～大悪党への道～', aloneMin: 122, withAdultMin: 0, area: 'ミニオン・パーク', childSwap: false, singleRider: false, image: '/images/attractions/ミニオン・ハチャメチャ・ミッション.jpg', strollerOk: true },

  // --- 102cm以上 ---
  { name: 'フライト・オブ・ザ・ヒッポグリフ™', aloneMin: 122, withAdultMin: 92, area: 'ウィザーディング・ワールド', childSwap: true, singleRider: false, image: '/images/attractions/フライト・オブ・ザ・ヒッポグリフ.jpg' },
  { name: 'マリオカート ～クッパの挑戦状～™', aloneMin: 122, withAdultMin: 107, area: 'スーパー・ニンテンドー・ワールド', childSwap: true, singleRider: true, image: '/images/attractions/マリオカート.jpg' },
  { name: 'ヨッシー・アドベンチャー™', aloneMin: 122, withAdultMin: 92, area: 'スーパー・ニンテンドー・ワールド', childSwap: true, singleRider: false, image: '/images/attractions/ヨッシー・アドベンチャー.jpg' },
  { name: 'ドンキーコングのクレイジー・トロッコ™', aloneMin: 122, withAdultMin: 107, area: 'ドンキーコング・カントリー', childSwap: true, singleRider: true, image: '/images/attractions/ドンキーコングのクレイジー・トロッコ.jpg' },

  // --- ワンダーランド系 ---
  { name: 'エルモのゴーゴー・スケートボード', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: true, image: '/images/attractions/エルモのゴーゴー・スケートボード.jpg' },
  { name: 'エルモのバブル・バブル', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/エルモのバブル・バブル.jpg' },
  { name: 'ビッグバードのビッグトップ・サーカス', aloneMin: 0, withAdultMin: 0, area: 'ワンダーランド', childSwap: false, singleRider: false, image: '/images/attractions/ビッグバードのビッグトップ・サーカス.jpg', note: '身長制限なし' },
  { name: 'フライング・スヌーピー', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/フライング・スヌーピー.jpg' },
  { name: 'ハローキティのカップケーキ・ドリーム', aloneMin: 0, withAdultMin: 0, area: 'ワンダーランド', childSwap: false, singleRider: false, image: '/images/attractions/ハローキティのカップケーキ・ドリーム.jpg', note: '身長制限なし' },
  { name: 'ミニオン・ハチャメチャ・アイス', aloneMin: 122, withAdultMin: 92, area: 'ミニオン・パーク', childSwap: true, singleRider: false, image: '/images/attractions/ミニオン・ハチャメチャ・アイス.jpg' },
  { name: 'モッピーのバルーン・トリップ', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/モッピーのバルーン・トリップ.jpg' },
  { name: 'スヌーピーのフライング・エース・アドベンチャー', aloneMin: 122, withAdultMin: 92, area: 'ワンダーランド', childSwap: true, singleRider: false, image: '/images/attractions/スヌーピーのフライング・エース・アドベンチャー.jpg' },

  // --- 身長制限なし（年齢制限あり・子供専用） ---
  { name: 'エルモのリトル・ドライブ', aloneMin: 0, withAdultMin: 0, area: 'ワンダーランド', childSwap: false, singleRider: false, image: '/images/attractions/エルモのリトル・ドライブ.jpg', note: '6歳未就学児限定（大人不可）' },
  { name: 'セサミのビッグ・ドライブ', aloneMin: 0, withAdultMin: 0, area: 'ワンダーランド', childSwap: false, singleRider: false, image: '/images/attractions/セサミのビッグ・ドライブ.jpg', note: '6歳〜12歳限定（大人不可）' },

  // --- 一人で座れたらOK ---
  { name: 'セサミストリート 4-D ムービーマジック™', aloneMin: 0, withAdultMin: 0, area: 'ハリウッド', childSwap: false, singleRider: false, image: '/images/attractions/セサミストリート4-D.jpg', note: '一人で座れたらOK' },
  { name: 'シュレック 4-D アドベンチャー™', aloneMin: 0, withAdultMin: 0, area: 'ハリウッド', childSwap: false, singleRider: false, image: '/images/attractions/シュレック4-D.jpg', note: '一人で座れたらOK' },
];

// 指定日に応じて期間限定コラボ版／通常版を切替えたアトラクション一覧を返す
// 期間中（start〜end）: コラボ版のみ表示、通常版は非表示
// 期間外: コラボ版は非表示、通常版のみ表示
export function getActiveHeightRestrictions(today: string): HeightRestriction[] {
  const activeVariants = new Set<string>();
  const suppressedBases = new Set<string>();
  for (const r of heightRestrictions) {
    if (r.seasonal && today >= r.seasonal.start && today <= r.seasonal.end) {
      activeVariants.add(r.name);
      suppressedBases.add(r.seasonal.replaces);
    }
  }
  return heightRestrictions.filter(r => {
    if (r.seasonal) return activeVariants.has(r.name);
    return !suppressedBases.has(r.name);
  });
}

// 妊婦さんが利用できるアトラクション・ショー
export interface PregnancyOkAttraction {
  name: string;
  area: string;
  image: string;
  note?: string;
}

export const pregnancyOkAttractions: PregnancyOkAttraction[] = [
  { name: 'ミニオン・ハチャメチャ・ミッション ～大悪党への道～', area: 'ミニオン・パーク', image: '/images/attractions/ミニオン・ハチャメチャ・ミッション.jpg' },
  { name: 'ビッグバードのビッグトップ・サーカス', area: 'ワンダーランド', image: '/images/attractions/ビッグバードのビッグトップ・サーカス.jpg', note: '利用にあたりクルーにご相談ください' },
  { name: 'ハローキティのリボン・コレクション', area: 'ワンダーランド', image: '/images/shows/キティのリボンコレクション.jpg' },
  { name: 'シング・オン・ツアー', area: 'ハリウッド', image: '/images/shows/シング・オン・ツアー.jpg' },
  { name: 'プレイング・ウィズおさるのジョージ™', area: 'ニューヨーク', image: '/images/shows/おさるのジョージ.jpg' },
  { name: 'ユニバーサル・モンスター・ライブ・ロックンロール・ショー', area: 'ハリウッド', image: '/images/shows/ユニバーサル・モンスター・ライブ・ロックンロール・ショー.jpg' },
  { name: 'ウォーターワールド', area: 'ウォーターワールド', image: '/images/shows/ウォーターワールド.jpg' },
  { name: 'オリバンダーの店™', area: 'ウィザーディング・ワールド', image: '/images/shows/オリバンダーの店.jpg' },
];

// 過去のアトラクション（クローズ済み）
export const closedAttractions: HeightRestriction[] = [
  { name: 'アメージング・アドベンチャー・オブ・スパイダーマン・ザ・ライド 4K3D', aloneMin: 122, withAdultMin: 102, area: 'ニューヨーク', childSwap: true, singleRider: true, image: '' },
];
