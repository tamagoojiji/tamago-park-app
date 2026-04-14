export interface TabearukiItem {
  name: string;
  price: number;
  shop: string;
  genre: string; // TABEARUKI_GENRES の id
}

// Obsidianのメニューデータから抽出
export const TABEARUKI_MENU: TabearukiItem[] = [
  // ポップコーン
  { name: 'マリオカート・ポップコーンバケツ', price: 5500, shop: 'ピットストップ・ポップコーン', genre: 'popcorn' },
  { name: 'ボムへい ポップコーンバケツ', price: 5500, shop: 'ピットストップ・ポップコーン', genre: 'popcorn' },

  // 肉系
  { name: 'SMOKED CHICKEN スモークチキン', price: 1300, shop: 'フォッシル・フュエルズ', genre: 'meat' },

  // コラボ系
  { name: 'パンケーキ・サンド マリオの帽子 〜いちごのショートケーキ〜', price: 950, shop: 'マリオ・カフェ&ストア', genre: 'collab' },
  { name: 'パンケーキ・サンド ルイージの帽子 〜ぶどうのレアチーズケーキ〜', price: 950, shop: 'マリオ・カフェ&ストア', genre: 'collab' },
  { name: 'ホット・パフェドリンク マリオのプリン・ア・ラ・モード', price: 850, shop: 'マリオ・カフェ&ストア', genre: 'collab' },
  { name: 'ホット・パフェドリンク ルイージのフルーツパフェ', price: 850, shop: 'マリオ・カフェ&ストア', genre: 'collab' },
  { name: 'ミニオン・クッキーサンド バナナアイス＆フルーツ', price: 700, shop: 'デリシャス・ミー！ ザ・クッキー・キッチン', genre: 'collab' },
  { name: 'ミニオン・クッキーサンド ストロベリーアンドチーズ', price: 700, shop: 'デリシャス・ミー！ ザ・クッキー・キッチン', genre: 'collab' },
  { name: 'こうらのカルツォーネ 〜焼きそば＆チーズ〜', price: 1100, shop: 'ヨッシー・スナック・アイランド', genre: 'collab' },

  // その他
  { name: '大悪党のためのドーナッツ・バーガー 〜BBQポーク＆ベーコン〜', price: 1200, shop: 'イーブル・イーツ', genre: 'other' },
  { name: 'イーブルミニオン・ドーナッツ 〜ブルーベリー〜', price: 850, shop: 'イーブル・イーツ', genre: 'other' },
  { name: 'ミニオン・ドーナッツ 〜バナナクリーム〜', price: 850, shop: 'イーブル・イーツ', genre: 'other' },
  { name: 'アイスクリーム スチュアート・バケツ（トリプル）', price: 1250, shop: 'アミティ・アイスクリーム', genre: 'other' },
  { name: 'アイスクリーム スチュアート・バケツ（ダブル）', price: 1100, shop: 'アミティ・アイスクリーム', genre: 'other' },
  { name: 'アイスクリーム スチュアート・バケツ（シングル）', price: 950, shop: 'アミティ・アイスクリーム', genre: 'other' },
  { name: 'ベーコン＆ハニーマスタード ピッツァ・デニッシュセット', price: 1600, shop: 'ボードウォーク・スナック', genre: 'other' },
  { name: '照り焼きチキン ピッツァ・デニッシュセット', price: 1600, shop: 'ボードウォーク・スナック', genre: 'other' },
  { name: 'エビと揚げパンのシーフードトマトスープ', price: 750, shop: 'ボードウォーク・スナック', genre: 'other' },
  { name: 'クラムチャウダー', price: 450, shop: 'ボードウォーク・スナック', genre: 'other' },

  // コラボ系（コナン）
  { name: '蝶ネクタイ型サンドウィッチ ボックス', price: 1500, shop: 'ロンバーズ・テラス', genre: 'collab' },
  { name: 'フルーツサングリアティー＆シェリービネガー', price: 800, shop: 'ロンバーズ・テラス', genre: 'collab' },
];
