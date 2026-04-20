export interface TabearukiItem {
  name: string;
  price: number;
  shop: string;
  genre: string; // TABEARUKI_GENRES の id
  suspended?: boolean; // 販売停止中フラグ（UIで非表示）
}

// 2026年4月時点で販売中の食べ歩きフード（Instagram @roi_usjfood + Obsidian統合）
export const TABEARUKI_MENU: TabearukiItem[] = [
  // ポップコーン
  { name: 'レギュラーカップ ポップコーン（キャラメル／塩）', price: 650, shop: 'ビバリーヒルズ・ギフト前ポップコーンカート 他', genre: 'popcorn' },
  { name: 'アニバーサリー・スーパースター・ポップコーンバケツ', price: 4800, shop: 'ピットストップ・ポップコーン', genre: 'popcorn' },
  { name: 'マリオカート・ポップコーンバケツ', price: 5500, shop: 'ピットストップ・ポップコーン', genre: 'popcorn' },
  { name: 'ボムへい・ポップコーンバケツ', price: 5500, shop: 'ピットストップ・ポップコーン', genre: 'popcorn' },
  { name: 'スーパースター・ポップコーンバケツ', price: 5000, shop: 'ビバリーヒルズ・ギフト前ポップコーンカート', genre: 'popcorn' },
  { name: 'デイブ・ポップコーンバケツ', price: 4500, shop: 'セントラルパーク入口横ポップコーンカート', genre: 'popcorn' },
  { name: 'デイブ・ヴィラン・コン・ポップコーンバケツ', price: 4500, shop: 'ユニバーサル・ワンダーランド入口横ポップコーンカート', genre: 'popcorn' },
  { name: 'ティム・ポップコーンバケツ', price: 4500, shop: 'ユニバーサル・ワンダーランド入口横ポップコーンカート', genre: 'popcorn' },
  { name: 'ジュラシック・ワールド・ポップコーンバケツ', price: 4000, shop: 'ディスカバリー・レストラン横ポップコーンカート', genre: 'popcorn' },
  { name: 'ラプトル&ジャイロスフィア・ポップコーンバケツ', price: 4000, shop: 'ディスカバリー・レストラン横ポップコーンカート', genre: 'popcorn' },
  { name: 'タイムターナー・スーベニアバケツ', price: 4800, shop: 'ポップコーンカート（ハリポタエリア）', genre: 'popcorn' },

  // キャラクターまん
  { name: '名探偵コナンまん 〜キーマカレー〜', price: 900, shop: 'カルフォルニア・コンフェクショナリー前カート', genre: 'character-man' },
  { name: 'マヨマヨツナマヨコーンまん', price: 850, shop: 'ユニバーサル・マーケット', genre: 'character-man' },
  { name: 'ターキーレッグ！？まん', price: 850, shop: 'スペース・ファンタジー・ザ・ライド前フードカート', genre: 'character-man' },
  { name: 'ミニオンまん 〜ハチャメチャカレー〜', price: 800, shop: 'ミニオン・ハッピーキッチン', genre: 'character-man' },
  { name: 'ハローキティまん 〜チーズ&ポーク〜', price: 800, shop: 'ハローキティのカップケーキ・ドリーム横ショップ', genre: 'character-man' },
  { name: 'ティムまん 〜チョコ〜', price: 800, shop: 'カルフォルニア・コンフェクショナリー前カート', genre: 'character-man', suspended: true },

  // チュリトス
  { name: '怪盗キッド・チュリトス 〜ホワイトグレープ味〜', price: 850, shop: 'カルフォルニア・コンフェクショナリー前カート', genre: 'churros' },
  { name: '虚式「茈」チュリトス 〜ミックスベリー味〜', price: 850, shop: 'シネマ4-D前フードカート', genre: 'churros' },
  { name: 'サーティワン・チュリトス 〜ポッピングシャワー〜', price: 850, shop: 'ユニバーサル・マーケット', genre: 'churros' },
  { name: 'サーティワン・チュリトス 〜ラブポーションサーティワン〜', price: 850, shop: 'ユニバーサル・マーケット', genre: 'churros' },
  { name: 'キャラメルポップコーン！？チュリトス', price: 800, shop: 'スペース・ファンタジー・ザ・ライド前フードカート', genre: 'churros' },
  { name: 'チョコレートチュリトス', price: 700, shop: 'ワンダーランド入口前カート 他', genre: 'churros' },
  { name: 'ジュラシック・パーク チョコレートチュリトス 〜レモン〜', price: 800, shop: 'ロストワールド・レストラン入口横フードカート', genre: 'churros' },
  { name: 'ハローキティ・チュリトス 〜いちごミルク〜', price: 800, shop: 'ハローキティのコーナーカフェ', genre: 'churros' },
  { name: 'ストロベリーチュリトス', price: 700, shop: 'エルモのプレイランド前フードカート／BIG FACE（ハリウッドエリア）', genre: 'churros' },
  { name: 'マイメロディ・チュリトス 〜いちごヨーグルト味〜', price: 850, shop: 'イルミネーション・シアター入口横カート', genre: 'churros' },
  { name: 'クロミ・チュリトス 〜カシスショコラ味〜', price: 850, shop: 'イルミネーション・シアター入口横カート', genre: 'churros' },
  { name: '4寮チュリトス', price: 850, shop: 'マジック・ニープ・カート', genre: 'churros' },
  { name: 'ウィキッド・チュリトス 〜ピーナッツバター・フレーバー〜', price: 850, shop: 'ユニバーサル・モンスター前カート', genre: 'churros' },
  { name: 'ドルチェチュリトス 〜ティラミス〜', price: 850, shop: 'ユニバーサル・マーケット', genre: 'churros', suspended: true },
  { name: 'ミニオンのチョコバナナ・チュリトス', price: 800, shop: 'ミニオン・ハッピーキッチン', genre: 'churros', suspended: true },

  // 肉系
  { name: 'アルトバイエルン・ドッグ 〜ミート・モンスター〜', price: 3500, shop: 'ユニバーサル・マーケット', genre: 'meat' },
  { name: 'サメのえじき', price: 1000, shop: 'アミティ・ランディング・レストラン横カート', genre: 'meat' },
  { name: 'ターキーレッグ', price: 1400, shop: 'バッテリーパーク北側カート', genre: 'meat' },
  { name: 'ブラックペッパー・ポークリブ', price: 1000, shop: 'ロストワールド・レストラン入口横フードカート', genre: 'meat' },
  { name: 'スモークチキン', price: 1300, shop: 'ジュラシック・パーク ゲート横フードカート', genre: 'meat' },
  { name: 'DKワイルドドッグ 〜アボカド&チーズソース〜', price: 1600, shop: 'ドンキーコングの家横カート', genre: 'meat' },
  { name: '大悪党のためのドーナツ・バーガー 〜BBQポーク&ベーコン〜', price: 1200, shop: 'イーブル・イーツ', genre: 'meat' },
  { name: 'プレミアム・ドッグ', price: 1000, shop: 'ユニバーサル・マーケット', genre: 'meat' },
  { name: 'ザクザク・スパイシー・チキン', price: 1200, shop: 'フォッシル・フュエルズ', genre: 'meat', suspended: true },
  { name: 'ホグワーツ・ミートパイ', price: 850, shop: 'マジック・ニープ・カート', genre: 'meat', suspended: true },
  { name: 'メルティ・チーズドッグ', price: 1200, shop: 'ユニバーサル・マーケット', genre: 'meat', suspended: true },
  { name: 'アンガス・ミートパイ', price: 850, shop: 'ワンダーランド入口前カート', genre: 'meat' },
  { name: 'チャイニーズ・ポークリブ', price: 1000, shop: 'サンフランシスコ・スナック', genre: 'meat' },
  { name: 'ホットドッグ', price: 900, shop: 'ワーフカフェ', genre: 'meat' },
  { name: 'ローーング！ソーセージパイ', price: 850, shop: 'ウォーターワールド前フードカート', genre: 'meat' },
  { name: 'ベーコン&ハニーマスタード ピッツァ・デニッシュセット', price: 1600, shop: 'ボードウォーク・スナック', genre: 'meat' },
  { name: '照り焼きチキン ピッツァ・デニッシュセット', price: 1600, shop: 'ボードウォーク・スナック', genre: 'meat' },

  // コラボ系
  { name: '蝶ネクタイ型サンドウィッチボックス', price: 1500, shop: 'ロンバーズ・ランディング・テラス', genre: 'collab' },
  { name: 'フルーツサングリアティー&シェリービネガー（アイス／ホット）', price: 800, shop: 'ロンバーズ・ランディング・テラス', genre: 'collab' },
  { name: '黒閃！チキンピザブレッド 〜旨辛ガーリック〜', price: 1000, shop: 'シネマ4-D前フードカート', genre: 'collab' },

  // アイス
  { name: 'ヤクルト・ソフトクリームサンデー 〜マンゴー〜', price: 1100, shop: 'ワーフカフェ', genre: 'ice' },
  { name: 'ヤクルト・ソフトクリームサンデー 〜ピーチ〜', price: 1100, shop: 'ワーフカフェ', genre: 'ice' },
  { name: 'DKクラッシュサンデー 〜トロピカルバナナ・フレーバー〜', price: 1500, shop: 'ジャングル・ビート・シェイク', genre: 'ice' },
  { name: 'ハローキティのフローズンスムージー 〜いちご〜', price: 800, shop: 'ハローキティのコーナーカフェ', genre: 'ice' },
  { name: 'ミニオン・クッキーサンド ストロベリーレアチーズ', price: 700, shop: 'デリシャス・ミー！ ザ・クッキー・キッチン', genre: 'ice' },
  { name: 'ミニオン・クッキーサンド バナナアイス&フルーツ', price: 700, shop: 'デリシャス・ミー！ ザ・クッキー・キッチン', genre: 'ice' },
  { name: 'アイスクリーム スチュアート・バケツ（シングル）', price: 950, shop: 'アミティ・アイスクリーム', genre: 'ice' },
  { name: 'アイスクリーム スチュアート・バケツ（ダブル）', price: 1100, shop: 'アミティ・アイスクリーム', genre: 'ice' },
  { name: 'アイスクリーム スチュアート・バケツ（トリプル）', price: 1250, shop: 'アミティ・アイスクリーム', genre: 'ice' },
  { name: 'ソフローズン メロン', price: 600, shop: 'BIG FACE（ハリウッドエリア）', genre: 'ice' },
  { name: 'アイスクリームフロート（レギュラー）', price: 550, shop: 'アミティ・アイスクリーム', genre: 'ice' },
  { name: 'アイスクリームフロート（ラージ）', price: 650, shop: 'アミティ・アイスクリーム', genre: 'ice' },

  // デザート
  { name: '無敵！スーパースター・パンケーキサンド 〜マンゴー〜', price: 1100, shop: 'マリオ・カフェ&ストア', genre: 'dessert' },
  { name: 'ウィスキー角瓶香るティラミス', price: 1000, shop: 'パークサイド・グリル', genre: 'dessert' },
  { name: 'ハローキティ・アップルパイ 〜マスカルポーネ〜', price: 750, shop: 'ハローキティのカップケーキ・ドリーム横ショップ', genre: 'dessert' },
  { name: 'パンケーキ・サンド（マリオ／ルイージ）', price: 950, shop: 'マリオ・カフェ&ストア', genre: 'dessert' },
  { name: 'ミニオン・ドーナツ 〜バナナクリーム〜', price: 850, shop: 'イーブル・イーツ', genre: 'dessert' },

  // ドリンク
  { name: 'パワーアップ！ソーダ（マリオ／ピーチ／ルイージ）', price: 900, shop: 'キノピオ・カフェ', genre: 'drink' },
  { name: '25周年カクテル 〜ポップコーンフレーバー〜', price: 900, shop: 'パークサイド・グリル', genre: 'drink' },
  { name: 'ジョーズ・スプラッシュ 〜ブルーハワイ&ソーダ〜', price: 700, shop: 'ボードウォーク・スナック', genre: 'drink' },
  { name: 'ハローキティ・ドリンク 〜ホワイトウォーター&いちご〜', price: 700, shop: 'ハローキティのカップケーキ・ドリーム横ショップ', genre: 'drink' },
  { name: 'スーパースター・レモンスカッシュ', price: 800, shop: 'キノピオ・カフェ', genre: 'drink' },
  { name: 'ヨッシーのラッシー（ストロベリー／マンゴー／メロン）', price: 900, shop: 'ヨッシー・スナック・アイランド', genre: 'drink' },
  { name: 'バター・ビール（ホット／アイス）', price: 900, shop: 'バタービールカート', genre: 'drink' },
  { name: 'バター・ビール WITH SOUVENIR（マグカップ付き）', price: 1500, shop: 'バタービールカート', genre: 'drink' },
  { name: 'バター・ビール（プレミアムマグカップ付き）', price: 5400, shop: 'バタービールカート', genre: 'drink' },
  { name: 'ミニオン・キャラメル チョコレートドリンク', price: 700, shop: 'デリシャス・ミー！ ザ・クッキー・キッチン', genre: 'drink' },
  { name: 'フルーツ・クリームソーダ（ルイージ／ピーチ）', price: 800, shop: 'マリオ・カフェ&ストア', genre: 'drink' },
  { name: 'ドリンクボトル（ファイアフラワー／スーパーキノコ）', price: 2700, shop: 'マリオ・カフェ&ストア', genre: 'drink' },
  { name: '憧れの大悪党？ボブ・ドリンクボトル', price: 2300, shop: 'デリシャス・ミー！ ザ・クッキー・キッチン', genre: 'drink' },
  { name: 'ザ・ホットチョコレート', price: 650, shop: 'アミティ・アイスクリーム', genre: 'drink' },

  // スープ
  { name: 'スープリゾット ライスコロッケ&ミネストローネ', price: 700, shop: 'ユニバーサル・マーケット', genre: 'soup' },
  { name: 'ブレッドボウル シュリンプチャウダー', price: 900, shop: 'ロンバーズ・ランディング・テラス', genre: 'soup' },
  { name: 'エビと揚げパンのシーフードトマトスープ', price: 750, shop: 'ボードウォーク・スナック', genre: 'soup' },
  { name: 'クラムチャウダー', price: 450, shop: 'ボードウォーク・スナック', genre: 'soup' },

  // その他
  { name: 'こうらのカルツォーネ 〜焼きそば&チーズ〜', price: 1100, shop: 'ヨッシー・スナック・アイランド', genre: 'other' },
  { name: 'イーブルミニオン・ドーナツ 〜ブルーベリー〜', price: 850, shop: 'イーブル・イーツ', genre: 'other' },
];
