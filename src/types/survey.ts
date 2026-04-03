// アンケート回答データの型定義

export interface SurveyFormData {
  // Step 1: 基本情報
  name: string;                    // Q1
  service_type: string;            // Q2
  visit_date: string;              // Q3 (YYYY-MM-DD)

  // Step 2: 参加メンバー
  party: PartyInfo;                // Q4
  child_heights: string;           // Q5

  // Step 3: 宿泊・交通・チケット・EP
  accommodation: string;           // Q6
  transportation: string;          // Q7
  tickets: string[];               // Q8
  express_pass: string;            // Q9

  // Step 4: スケジュール
  start_time: string;              // Q10
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
  greetings: string[];             // Q19

  // Step 7: 食事
  morning_meal: string;            // Q20
  lunch: string;                   // Q21
  dinner: string;                  // Q22
  food_preferences: string;        // Q23
  allergies: string;               // Q24

  // Step 8: その他
  budget_level: string;            // Q25
  power_up_band: string;           // Q26
  magic_wand: string;              // Q27
  club_universal: string;          // Q28
  official_app: string;            // Q29
  ticket_registered: string;       // Q30
  special_requests: string;        // Q31
  unknown_terms: string[];         // Q32
  referral_source: string[];       // Q33
  meet_ok: string;                 // Q34
}

export interface PartyInfo {
  adults: number;
  highschool: number;
  middleschool: number;
  elementary_upper: number;  // 小学4-6
  elementary_lower: number;  // 小学1-3
  preschool: number;         // 5-6歳
  toddler: number;           // 0-4歳
}

export const EMPTY_PARTY: PartyInfo = {
  adults: 0,
  highschool: 0,
  middleschool: 0,
  elementary_upper: 0,
  elementary_lower: 0,
  preschool: 0,
  toddler: 0,
};

export const INITIAL_SURVEY: SurveyFormData = {
  name: '',
  service_type: '',
  visit_date: '',
  party: { ...EMPTY_PARTY },
  child_heights: '',
  accommodation: '',
  transportation: '',
  tickets: [],
  express_pass: '',
  start_time: '',
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
  dinner: '',
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
  meet_ok: '',
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
