// レストランのジャンル分類
export interface GenreInfo {
  id: string;
  label: string;
  icon: string;
}

export const RESTAURANT_GENRES: GenreInfo[] = [
  { id: 'all', label: '一覧', icon: '📋' },
  { id: 'pizza', label: 'ピザ', icon: '🍕' },
  { id: 'burger', label: 'ハンバーガー', icon: '🍔' },
  { id: 'pasta', label: 'パスタ系', icon: '🍝' },
  { id: 'plate', label: 'プレート系', icon: '🍛' },
  { id: 'collab', label: 'コラボフード', icon: '⭐' },
  { id: 'burrito', label: 'ブリトー', icon: '🌯' },
  { id: 'japanese', label: '和食', icon: '🍣' },
  { id: 'chinese', label: '中華', icon: '🥟' },
  { id: 'premium-meat', label: '高級肉系', icon: '🥩' },
];

// 食べ歩きフード大カテゴリ
export const TABEARUKI_CATEGORIES: GenreInfo[] = [
  { id: 'tabearuki', label: '食べ歩き', icon: '🍦' },
  { id: 'food', label: 'フード', icon: '🍗' },
];

// 食べ歩き(軽食)サブジャンル
export const TABEARUKI_SUB_GENRES: GenreInfo[] = [
  { id: 'ice', label: 'アイス', icon: '🍦' },
  { id: 'churros', label: 'チュリトス', icon: '🥖' },
  { id: 'popcorn', label: 'ポップコーン', icon: '🍿' },
  { id: 'character-man', label: 'キャラまん', icon: '🐻' },
  { id: 'drink', label: 'ドリンク', icon: '🥤' },
  { id: 'alcohol', label: 'アルコール', icon: '🍺' },
  { id: 'dessert', label: 'デザート', icon: '🍰' },
  { id: 'other', label: 'その他', icon: '🍽️' },
];

// フード(食事系)サブジャンル
export const FOOD_SUB_GENRES: GenreInfo[] = [
  { id: 'meat', label: '肉系', icon: '🍗' },
  { id: 'pizza', label: 'ピザ', icon: '🍕' },
  { id: 'hotdog', label: 'ホットドッグ', icon: '🌭' },
  { id: 'soup', label: 'スープ', icon: '🍲' },
];

// 特別タブ: 販売開始日が未来のメニューを集約（saleStartの日付で自動判定）
export const UPCOMING_GENRE: GenreInfo = { id: 'upcoming', label: '今後販売予定', icon: '📅' };

// クローズ中のレストラン（API結果からフィルタ）
export const CLOSED_RESTAURANTS = new Set([
  'アズーラ・ディ・カプリ',
  'フィネガンズ・バー＆グリル',
]);

// 営業時間が公式に「クルーに問合せ」になっている店舗の表示テキスト上書き
export const RESTAURANT_HOURS_OVERRIDE: Record<string, string> = {
  'ルイズ N.Y. ピザパーラー': '一時クローズ',
  'ロストワールド・レストラン': '一時クローズ',
  'ロンバーズ・ランディング™': '名探偵コナン・ミステリー・レストラン参照',
};

// レストラン名 → ジャンルID のマッピング（複数ジャンル対応）
export const RESTAURANT_GENRE_MAP: Record<string, string[]> = {
  'ルイズ N.Y. ピザパーラー': ['pizza'],
  'メルズ・ドライブイン': ['burger'],
  'ディスカバリー・レストラン': ['burger', 'collab'],
  'アミティ・ランディング・レストラン': ['burrito'],
  'ロストワールド・レストラン': ['plate', 'collab'],
  'ロンバーズ・ランディング™': ['plate'],
  'ハピネス・カフェ®': ['plate', 'collab'],
  'スタジオ・スターズ・レストラン': ['plate', 'collab'],
  'キノピオ・カフェ™': ['collab'],
  'スヌーピー™・バックロット・カフェ': ['pasta', 'collab'],
  'SAIDO': ['japanese'],
  'ザ・ドラゴンズ・パール': ['chinese'],
  '三本の箒™': ['plate', 'collab'],
  'パークサイド・グリル': ['premium-meat'],
  'フィネガンズ・バー＆グリル': ['premium-meat'],
  'ビバリーヒルズ・ブランジェリー': ['collab'],
  'ホッグズ・ヘッド・パブ': ['plate', 'collab'],
};

// 食べ歩き名 → ジャンルID のマッピング
export const TABEARUKI_GENRE_MAP: Record<string, string> = {
  'ピットストップ・ポップコーン': 'popcorn',
  'フォッシル・フュエルズ': 'meat',
  'イーブル・イーツ': 'meat',
  'ハローキティのコーナーカフェ': 'collab',
  'ワーフカフェ': 'other',
  'マリオ・カフェ&ストア': 'collab',
  'ヨッシー・スナック・アイランド': 'collab',
  'デリシャス・ミー！ ザ・クッキー・キッチン': 'collab',
  'アミティ・アイスクリーム': 'other',
  'ボードウォーク・スナック': 'other',
  'ジャングル・ビート・シェイク': 'other',
  'ポパ・ナーナ': 'other',
  'マジック・ニープ™・カート': 'other',
};

// 期間限定画像の定義
interface LimitedImage {
  image: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

const LIMITED_RESTAURANT_IMAGES: Record<string, LimitedImage> = {
  'ロストワールド・レストラン': {
    image: '/images/restaurants/lost-world-mh-collab.png',
    start: '2025-11-19',
    end: '2026-05-17',
  },
};

// レストラン名 → 画像パス のマッピング（通常時）
const BASE_RESTAURANT_IMAGE_MAP: Record<string, string> = {
  'ルイズ N.Y. ピザパーラー': '/images/restaurants/louis-ny-pizza.jpg',
  'メルズ・ドライブイン': '/images/restaurants/mels-drive-in.jpg',
  'ディスカバリー・レストラン': '/images/restaurants/discovery-restaurant.jpg',
  'アミティ・ランディング・レストラン': '/images/restaurants/amity-landing.jpg',
  'ロストワールド・レストラン': '/images/restaurants/lost-world-restaurant.jpg',
  'ハピネス・カフェ®': '/images/restaurants/happiness-cafe.jpg',
  'スタジオ・スターズ・レストラン': '/images/restaurants/studio-stars-restaurant.jpg',
  'キノピオ・カフェ™': '/images/restaurants/kinopio-cafe.jpg',
  'スヌーピー™・バックロット・カフェ': '/images/restaurants/snoopy-backlot-cafe.jpg',
  'SAIDO': '/images/restaurants/saido.jpg',
  '三本の箒™': '/images/restaurants/three-broomsticks.jpg',
  'ビバリーヒルズ・ブランジェリー': '/images/restaurants/beverly-hills-boulangerie.jpg',
  'ザ・ドラゴンズ・パール': '/images/restaurants/dragons-pearl.jpg',
  'パークサイド・グリル': '/images/restaurants/parkside-grille.jpg',
  'ロンバーズ・ランディング™': '/images/restaurants/ロンバーズ・ランディング.png',
  'ホッグズ・ヘッド・パブ': '/images/restaurants/ホッグズ・ヘッド・パブ.png',
};

// 期間限定を考慮した画像マップを生成
function buildImageMap(): Record<string, string> {
  const today = new Date().toISOString().slice(0, 10);
  const map = { ...BASE_RESTAURANT_IMAGE_MAP };
  for (const [name, limited] of Object.entries(LIMITED_RESTAURANT_IMAGES)) {
    if (today >= limited.start && today <= limited.end) {
      map[name] = limited.image;
    }
  }
  return map;
}

export const RESTAURANT_IMAGE_MAP = buildImageMap();

// 食べ歩きジャンル → 画像パス のマッピング
export const TABEARUKI_IMAGE_MAP: Record<string, string> = {
  'churros': '/images/restaurants/churros-31.jpg',
  'character-man': '/images/restaurants/character-man.jpg',
};

// 食べ歩き判定
export const TABEARUKI_SET = new Set(Object.keys(TABEARUKI_GENRE_MAP));

export function isTabearuki(name: string): boolean {
  return TABEARUKI_SET.has(name);
}
