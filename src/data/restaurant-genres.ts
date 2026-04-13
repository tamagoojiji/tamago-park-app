// レストランのジャンル分類
export interface GenreInfo {
  id: string;
  label: string;
  icon: string;
}

export const RESTAURANT_GENRES: GenreInfo[] = [
  { id: 'all', label: '一覧を見る', icon: '📋' },
  { id: 'pizza', label: 'ピザ', icon: '🍕' },
  { id: 'burger', label: 'ハンバーガー', icon: '🍔' },
  { id: 'pasta', label: 'パスタ系', icon: '🍝' },
  { id: 'plate', label: 'プレート系', icon: '🍛' },
  { id: 'collab', label: 'コラボフード', icon: '⭐' },
  { id: 'burrito', label: 'ブリトー', icon: '🌯' },
  { id: 'japanese', label: '和食', icon: '🍣' },
  { id: 'premium-meat', label: '高級肉系', icon: '🥩' },
];

export const TABEARUKI_GENRES: GenreInfo[] = [
  { id: 'popcorn', label: 'ポップコーン', icon: '🍿' },
  { id: 'character-man', label: 'キャラクターまん', icon: '🐻' },
  { id: 'meat', label: '肉系', icon: '🍗' },
  { id: 'churros', label: 'チュリトス', icon: '🥖' },
  { id: 'collab', label: 'コラボ系', icon: '⭐' },
  { id: 'other', label: 'その他', icon: '🍦' },
];

// レストラン名 → ジャンルID のマッピング
export const RESTAURANT_GENRE_MAP: Record<string, string> = {
  'ルイズ N.Y. ピザパーラー': 'pizza',
  'メルズ・ドライブイン': 'burger',
  'アズーラ・ディ・カプリ': 'pasta',
  'ディスカバリー・レストラン': 'plate',
  'アミティ・ランディング・レストラン': 'plate',
  'ロストワールド・レストラン': 'plate',
  'ロンバーズ・ランディング™': 'plate',
  'ハピネス・カフェ®': 'plate',
  'スタジオ･スターズ･レストラン': 'plate',
  'キノピオ・カフェ': 'collab',
  'ハローキティのコーナーカフェ': 'collab',
  'スヌーピー™・バックロット・カフェ': 'collab',
  'ワーフカフェ': 'burrito',
  'SAIDO': 'japanese',
  'ザ・ドラゴンズ・パール': 'japanese',
  '三本の箒™': 'plate',
  'パークサイド・グリル': 'premium-meat',
  'フィネガンズ・バー＆グリル': 'premium-meat',
  'ビバリーヒルズ・ブランジェリー': 'plate',
  'ホッグズ・ヘッド・パブ': 'plate',
};

// 食べ歩き名 → ジャンルID のマッピング
export const TABEARUKI_GENRE_MAP: Record<string, string> = {
  'ピットストップ・ポップコーン': 'popcorn',
  'フォッシル・フュエルズ': 'meat',
  'イーブル・イーツ': 'meat',
  'マリオ・カフェ&ストア': 'collab',
  'ヨッシー・スナック・アイランド': 'collab',
  'デリシャス・ミー！ ザ・クッキー・キッチン': 'collab',
  'アミティ・アイスクリーム': 'other',
  'ボードウォーク・スナック': 'other',
  'ジャングル・ビート・シェイク': 'other',
  'ポパ・ナーナ': 'other',
  'マジック・ニープ™・カート': 'other',
};

// 食べ歩き判定
export const TABEARUKI_SET = new Set(Object.keys(TABEARUKI_GENRE_MAP));

export function isTabearuki(name: string): boolean {
  return TABEARUKI_SET.has(name);
}
