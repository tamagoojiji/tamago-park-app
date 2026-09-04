import { ATTRACTION_CLOSED_FROM } from './height-restrictions';

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

// Q8: チケット購入確認
export const TICKET_PURCHASED_OPTIONS = [
  '購入済み',
  'まだ購入していない',
  '年パス保有者',
] as const;

// Q8: チケット種別
export const TICKET_OPTIONS = [
  'ワンデイ',
  '2デイ',
  '1.5デイ',
  '夜間貸切ナイト',
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
  'ジュラシック・パーク',
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
  'スペース・ファンタジー・ザ・ライド ～CLUB ZEDD REMIX～',
  'ジュラシック・パーク・ザ・ライド',
  'ジョーズ',
  'ミニオン・ハチャメチャ・ライド',
  'マリオカート ～クッパの挑戦状～',
  'ドンキーコングのクレイジー・トロッコ™',
  'フライト・オブ・ザ・ヒッポグリフ™',
] as const;

// Q16: キッズ系アトラクション
export const KIDS_ATTRACTION_OPTIONS = [
  'フライング・スヌーピー',
  'スヌーピーのフライング・エース・アドベンチャー',
  'エルモのゴーゴー・スケートボード',
  'モッピーのバルーン・トリップ',
  'ビッグバードのビッグトップ・サーカス',
  'エルモのバブル・バブル',
  'エルモのリトル・ドライブ',
  'セサミのビッグ・ドライブ',
  'ハローキティのカップケーキ・ドリーム',
  'ミニオン・ハチャメチャ・アイス',
  'ミニオン・ハチャメチャ・ミッション ～大悪党への道～',
  'ヨッシー・アドベンチャー',
  'セサミストリート 4-D ムービーマジック™',
  'シュレック 4-D アドベンチャー™',
] as const;

// 期間限定コラボ: 期間中はvariantのみ表示、期間外はbaseのみ表示
export const SEASONAL_ATTRACTION_VARIANTS: { base: string; variant: string; start: string; end: string }[] = [
  {
    base: 'スペース・ファンタジー・ザ・ライド',
    variant: 'スペース・ファンタジー・ザ・ライド ～CLUB ZEDD REMIX～',
    start: '2026-01-30',
    end: '2026-08-17',
  },
];

export function applySeasonalVariants(options: readonly string[], today: string): string[] {
  const activeVariants = new Set<string>();
  const suppressedBases = new Set<string>();
  for (const v of SEASONAL_ATTRACTION_VARIANTS) {
    if (today >= v.start && today <= v.end) {
      activeVariants.add(v.variant);
      suppressedBases.add(v.base);
    }
  }
  return options.filter(name => {
    if (suppressedBases.has(name)) return false;
    const v = SEASONAL_ATTRACTION_VARIANTS.find(x => x.variant === name);
    if (v && !activeVariants.has(name)) return false;
    const closedFrom = ATTRACTION_CLOSED_FROM[name];
    if (closedFrom && today >= closedFrom) return false;
    return true;
  });
}

// Q16: よやくのり対象アトラクション
export const YOYAKUNORI_ATTRACTIONS = new Set([
  'フライング・スヌーピー',
  'スヌーピーのフライング・エース・アドベンチャー',
  'エルモのゴーゴー・スケートボード',
  'モッピーのバルーン・トリップ',
  'エルモのバブル・バブル',
]);

// Q17: 常設ショー・体験
export const SHOW_OPTIONS = [
  'ユニバーサル・モンスター・ライブ・ロックンロール・ショー',
  'ウォーターワールド',
  'モッピーのラッキー・ダンス・パーティ',
  'シング・オン・ツアー',
  'プレイング・ウィズおさるのジョージ™',
  '名探偵コナン 4-D ライブ・ショー ～星空の宝石（ジュエル）～',
  'オリバンダーの店™',
  'スヌーピー・フォト・オポチュニティ',
  'ハローキティのリボン・コレクション',
] as const;


// Q18: 季節・期間限定ショー（後日events APIに移行予定）
export const SEASONAL_SHOW_OPTIONS = [
  'NO LIMIT! パレード ～Discover U!!! バージョン～',
  'アルティメット・ブルース・バッシュ ～音楽の色～',
  'ウィキッド ～オズの魔女たち～',
  'クロミ・ライブ ～ Discover Me Discover U!!! ～',
  'ジュラシック・ワールド・ディノ・エンカウンター（草食恐竜）',
  'ジュラシック・ワールド・ベイビー・ディノ・アドベンチャー（赤ちゃん恐竜）',
  'ジュラシック・ワールド・ラプター・アラート（肉食恐竜）',
  'パワー・オブ・ロック ～ユー・ロック！～',
  'ヒッポグリフ・マジカル・レッスン',
  'フロッグ・クワイア',
  'ホグズミード・マジカル・クリーチャーズ・ミート',
  'ユニバーサル・ワンダーランド ～レッツ・スマイル・トゥギャザー！〜',
] as const;

// Q18: ハロウィーン限定（ハロウィーン・ホラー・ナイト 2026）。来園日が期間内のときだけ表示。
// end 指定があるものは個別に延長。timetable=true は公式ショースケジュール掲載対象（「この日は公演なし」バッジ判定の対象）
export const HALLOWEEN_PERIOD = { start: '2026-09-11', end: '2026-11-08' } as const;

export const HALLOWEEN_EVENT_OPTIONS: { name: string; start?: string; end?: string; timetable?: boolean }[] = [
  // ショー
  { name: 'ゾンビ・デ・ダンス', timetable: true },
  { name: 'プレイバック・ゾンビ・デ・ダンス ～ハロウィーン・ホラー・ナイト 15周年～', timetable: true },
  { name: 'ハロウィーン・ホラー・ナイト・アカデミー ～絶叫の15年～', timetable: true },
  { name: '残像' },
  { name: 'ミニオン・ベロウィーン・グリーティング', timetable: true },
  // グリーティング・イベント
  { name: 'スマイリーズ・ハッピー・ハロウィーン・グリーティング' },
  { name: 'ストリート・ゾンビ' },
  { name: 'パーク中で「トリック・オア・トリート」' },
  { name: 'ハロウィーン・ホラー・ナイト ～オールナイト～', start: '2026-09-25', end: '2026-09-25' }, // 9/25の1日限り
  // ホラー・アトラクション
  { name: 'ファクトリー・オブ・フィアー ～絶望のゾンビ・ツアー～' },
  { name: 'KATE PRESENTS『18番地の魔女 ～感情と戯れる魔女の館～』' },
  { name: 'チェンソーマン・ザ・カオス 4-D' },
  { name: 'チェンソーマン × ハリウッド・ドリーム・ザ・ライド ～IRIS OUT～' },
  { name: 'ゾンビ・デ・ダンス × ハリウッド・ドリーム・ザ・ライド' },
  { name: 'ジュラシック・パーク・ザ・ライド ～イン・ザ・ダーク～' },
  { name: '貞子の呪い ～ダーク・ホラー・ライド～', end: '2027-01-04' },
  { name: 'ジョーズ ～レッド・アラート～', end: '2027-01-31' },
  { name: '『バイオハザード レクイエム』ザ・ダイブ', end: '2026-12-27' },
];

/** 来園日に表示するハロウィーン項目。日付未入力なら空 */
export function activeHalloweenOptions(visitDate: string): { name: string; timetable?: boolean }[] {
  if (!visitDate || visitDate < HALLOWEEN_PERIOD.start) return [];
  return HALLOWEEN_EVENT_OPTIONS.filter(
    (o) => visitDate >= (o.start ?? HALLOWEEN_PERIOD.start) && visitDate <= (o.end ?? HALLOWEEN_PERIOD.end),
  );
}

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
  '荷物検査場入るまでに食べる',
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

// Q21/Q22: 食事ジャンル（食べ歩き・簡単なレストラン選択時）
export const FOOD_TYPE_OPTIONS = [
  'サンド系',
  'ハンバーガー',
  'ピザ',
  'パスタ',
  '中華',
  'コラボ飯',
  'ブリトー',
  'プレート系',
  '和食',
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
  '会ってもいい',
  '会いたくない',
  'その他',
] as const;
