// アンケート全選択肢の定数定義

// Q2: サービス種別
export const SERVICE_TYPES = [
  'プランニング希望',
  'アテンドの詳細知りたい',
  'アテンド希望',
] as const;

// Q3: 来園日ごとの開始時間
export const VISIT_START_TIME_OPTIONS = [
  '朝から',
  '昼から',
  '14時から(貸切イベント)',
  '15時から',
] as const;

// Q4: 年齢カテゴリ
export const PARTY_CATEGORIES = [
  { key: 'adults', label: '大人' },
  { key: 'highschool', label: '高校生' },
  { key: 'middleschool', label: '中学生' },
  { key: 'elementary', label: '小学生' },
  { key: 'young_children', label: '0歳〜6歳' },
] as const;

// Q4: 小学生の学年選択肢
export const ELEMENTARY_GRADE_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

// Q4: 幼児の年齢選択肢
export const YOUNG_CHILDREN_AGE_OPTIONS = [0, 1, 2, 3, 4, 5, 6] as const;

// Q6: 宿泊
export const ACCOMMODATION_OPTIONS = [
  'ユニバ周辺のホテル',
  '少し離れたホテル',
  '泊まらない',
  'その他',
] as const;

// Q7: 交通手段
export const TRANSPORTATION_OPTIONS = [
  '車',
  '公共交通機関',
  'その他',
] as const;

// Q8: チケット
export const TICKET_OPTIONS = [
  'ワンデイ',
  '2デイ',
  '1.5デイ',
  '夜間貸切ナイト',
  '年パス保有者',
  '年パス購入予定',
  'まだ買ってない',
  'その他',
] as const;

// Q9: エクスプレスパス
export const EXPRESS_PASS_OPTIONS = [
  'なし',
  'あり',
  'その他',
] as const;

// Q11: 並び開始
export const LINEUP_TIME_OPTIONS = [
  '6:00',
  '6:30',
  '7:00',
  '8:00',
  'それ以降',
] as const;

// Q12: 終了時間
export const END_TIME_OPTIONS = [
  '昼過ぎまで',
  '夕方まで',
  '閉園まで',
  'その他',
] as const;

// Q13: キャラクター
export const CHARACTER_OPTIONS = [
  'ウッディー',
  'セサミ',
  'キティー',
  'ピーナッツ',
  'ミニオン',
  'SING',
  'コナン',
  'ジョーズ',
  'ジョージ',
  'ビートルジュース',
  'ハリーポッター',
  'シュレック',
  'ジュラシック',
  'マリオ',
  'ポケモン',
] as const;

// Q14: メイン活動
export const MAIN_ACTIVITY_OPTIONS = [
  'アトラクション絶叫系',
  'アトラクションキッズ系',
  'ショーやパレード',
  'グリーティング',
] as const;

// Q15: 絶叫系アトラクション
export const THRILL_ATTRACTION_OPTIONS = [
  'ハリウッド・ドリーム・ザ・ライド',
  'ハリウッド・ドリーム・ザ・ライド ～バックドロップ～',
  'ザ・フライング・ダイナソー',
  'ハリー・ポッター・アンド・ザ・フォービドゥン・ジャーニー',
  'スペース・ファンタジー・ザ・ライド',
  'ジュラシック・パーク・ザ・ライド',
  'ジョーズ',
  'スパイダーマン・ザ・ライド',
  'ミニオン・ハチャメチャ・ライド',
  'マリオカート ～クッパの挑戦状～',
  'ヨッシー・アドベンチャー',
] as const;

// Q16: キッズ系アトラクション
export const KIDS_ATTRACTION_OPTIONS = [
  'フライング・スヌーピー',
  'エルモのゴーゴー・スケートボード',
  'モッピーのバルーン・トリップ',
  'ビッグバードのビッグトップ・サーカス',
  'エルモのバブル・バブル',
  'エルモのリトル・ドライブ',
  'セサミのビッグ・ドライブ',
  'ハローキティのカップケーキ・ドリーム',
  'ミニオン・ハチャメチャ・アイス',
  'プレイング・ウィズ おさるのジョージ',
] as const;

// Q17: 常設ショー
export const SHOW_OPTIONS = [
  'ユニバーサル・モンスター・ライブ・ロックンロール・ショー',
  'ウォーターワールド',
  'モッピーのラッキー・ダンス・パーティ',
  'シング・オン・ツアー',
  'おさるのジョージ',
  '名探偵コナン４Dライブショー',
] as const;


// Q19: グリーティング
export const GREETING_OPTIONS = [
  'いいえ',
  'ミニオン',
  'セサミストリート',
  'ピーナッツ',
  '長ぐつをはいたネコ',
  'シュレック',
] as const;

// Q20: モーニング
export const MORNING_MEAL_OPTIONS = [
  'ゲートOPEN前に食べる',
  'OPEN後に食べる',
  '食べたいものあり',
  'その他',
] as const;

// Q21: ランチ
export const LUNCH_OPTIONS = [
  '食べ歩き',
  '簡単なレストラン',
  'がっつり',
  '食べたいものあり',
  'その他',
] as const;

// Q22: ディナー
export const DINNER_OPTIONS = [
  '食べ歩き',
  '簡単なレストラン',
  'がっつり',
  'シティーウォーク',
  '食べたいものあり',
  'その他',
] as const;

// Q25: 課金レベル
export const BUDGET_OPTIONS = [
  '考えていない',
  'ショー・パレード時短課金',
  'エクスプレスパス購入予定',
  'その他',
] as const;

// Q26: パワーアップバンド
export const POWER_UP_BAND_OPTIONS = [
  '購入予定',
  '持参',
  '購入しない',
  'その他',
] as const;

// Q27: 魔法の杖
export const MAGIC_WAND_OPTIONS = [
  '購入予定',
  '持参',
  '購入しない',
  'その他',
] as const;

// Q28: クラブユニバーサル
export const CLUB_UNIVERSAL_OPTIONS = [
  '作成済み',
  '未作成',
  'その他',
] as const;

// Q29: 公式アプリ
export const OFFICIAL_APP_OPTIONS = [
  '代表者のみ',
  '2人以上',
  'していない',
  'その他',
] as const;

// Q30: チケット登録
export const TICKET_REGISTERED_OPTIONS = [
  '登録済み',
  '未登録（方法わかる）',
  '未登録（教えてほしい）',
  'チケット未購入',
  'その他',
] as const;

// Q32: 知らない言葉
export const UNKNOWN_TERMS_OPTIONS = [
  'インパ',
  'アウパ',
  'エクスプレスパス',
  'チャイルドスイッチ',
  'キーチャレンジ',
  'ニンテンドーエリアフリー入場',
  'グラマシー',
  'ラグーン',
  'キャノピー',
] as const;

// Q33: 流入元
export const REFERRAL_OPTIONS = [
  'Instagram',
  'Facebook',
  'Tiktok',
  'Youtube',
  'Warpcast',
  'Instagram発信者紹介',
  '知り合いからの紹介',
  'その他',
] as const;

// Q34: 当日会う
export const MEET_OPTIONS = [
  '会いたくない',
  '会ってもいい',
  'その他',
] as const;
