// アンケート回答データの型定義

export interface VisitDateEntry {
  date: string;       // YYYY-MM-DD
  start_time: string; // 朝から / 昼から / 14時から(貸切イベント) / 15時から
}

export interface ChildHeightEntry {
  label: string;   // "小学3年生" or "3歳"
  height: string;  // "120" etc
}

export interface SurveyFormData {
  // Step 1: 基本情報
  name: string;                    // Q1
  service_type: string;            // Q2
  visit_dates: VisitDateEntry[];   // Q3 (複数日+各日の開始時間)

  // Step 2: 参加メンバー
  party: PartyInfo;                // Q4
  elementary_grades: number[];     // Q4: 各小学生の学年 (1-6)
  young_children_ages: number[];   // Q4: 各幼児の年齢 (0-6)
  child_heights: ChildHeightEntry[]; // Q5

  // Step 3: 宿泊・交通・チケット・EP
  accommodation: string;           // Q6
  transportation: string;          // Q7
  ticket_purchased: string;        // Q8: 購入済みかどうか
  tickets: string[];               // Q8: チケット種別
  express_pass: string;            // Q9

  // Step 4: スケジュール (Q10削除)
  lineup_time: string;             // Q11
  end_time: string;                // Q12

  // Step 5: キャラ・アトラクション
  favorite_characters: string[];   // Q13
  main_activities: string[];       // Q14
  thrill_attractions: string[];    // Q15
  kids_attractions: string[];      // Q16

  // Step 6: ショー・イベント・グリーティング
  shows: string[];                 // Q17
  seasonal_events: string[];       // Q18
  greetings: string[];             // Q20

  // Step 7: 食事
  morning_meal: string;            // Q21
  lunch: string;                   // Q22
  lunch_food_types: string[];      // Q22: ランチ何系
  lunch_comment: string;           // Q22: 食べたいものコメント
  dinner: string;                  // Q23
  dinner_food_types: string[];     // Q23: ディナー何系
  dinner_comment: string;          // Q23: 食べたいものコメント
  food_preferences: string;        // Q24
  allergies: string;               // Q25

  // Step 8: その他
  budget_level: string;            // Q26
  power_up_band: string;           // Q27
  magic_wand: string;              // Q28
  club_universal: string;          // Q29
  official_app: string;            // Q30
  ticket_registered: string;       // Q31
  special_requests: string;        // Q32
  unknown_terms: string[];         // Q33
  referral_source: string[];       // Q34
  referral_introducer: string;     // Q34: Instagram発信者名
  referral_acquaintance: string;   // Q34: 知り合いのアカウント
  meet_ok: string;                 // Q35

  // 全項目共通: 「その他」選択時のコメント
  other_comments: Record<string, string>;
}

export interface PartyInfo {
  adults: number;
  highschool: number;
  middleschool: number;
  elementary: number;       // 小学生（合算）
  young_children: number;   // 0〜6歳（合算）
}

export const EMPTY_PARTY: PartyInfo = {
  adults: 0,
  highschool: 0,
  middleschool: 0,
  elementary: 0,
  young_children: 0,
};

export const INITIAL_SURVEY: SurveyFormData = {
  name: '',
  service_type: '',
  visit_dates: [],
  party: { ...EMPTY_PARTY },
  elementary_grades: [],
  young_children_ages: [],
  child_heights: [],
  accommodation: '',
  transportation: '',
  ticket_purchased: '',
  tickets: [],
  express_pass: '',
  lineup_time: '',
  end_time: '',
  favorite_characters: [],
  main_activities: [],
  thrill_attractions: [],
  kids_attractions: [],
  shows: [],
  seasonal_events: [],
  greetings: [],
  morning_meal: '',
  lunch: '',
  lunch_food_types: [],
  lunch_comment: '',
  dinner: '',
  dinner_food_types: [],
  dinner_comment: '',
  food_preferences: '',
  allergies: '',
  budget_level: '',
  power_up_band: '',
  magic_wand: '',
  club_universal: '',
  official_app: '',
  ticket_registered: '',
  special_requests: '',
  unknown_terms: [],
  referral_source: [],
  referral_introducer: '',
  referral_acquaintance: '',
  meet_ok: '',
  other_comments: {},
};

// ステップ定義
export interface StepDef {
  label: string;
  icon: string;
}

export const STEPS: StepDef[] = [
  { label: '基本情報', icon: '👤' },
  { label: '参加メンバー', icon: '👨‍👩‍👧‍👦' },
  { label: '宿泊・交通', icon: '🚗' },
  { label: 'スケジュール', icon: '⏰' },
  { label: 'アトラクション', icon: '🎢' },
  { label: 'ショー・イベント', icon: '🎭' },
  { label: '食事', icon: '🍽️' },
  { label: 'その他', icon: '📝' },
];
