// USJクイズ機能の型定義

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuizCategory =
  | 'attraction_basic'
  | 'trivia'
  | 'area'
  | 'show'
  | 'restaurant'
  | 'character'
  | 'ticket_pass'
  | 'tips'
  | 'history'
  | 'seasonal';

export type QuizStatus = 'active' | 'hidden' | 'deprecated';

export interface Quiz {
  id: number;
  code: string;
  category: QuizCategory | string;
  categoryLabel: string;
  difficulty: QuizDifficulty | string;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation?: string | null;
  needsReview?: boolean;
}

export interface QuizAdmin extends Quiz {
  status: QuizStatus | string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizAnswerResponse {
  isCorrect: boolean;
  answerIndex: number;
  explanation?: string | null;
  totalAnswered: number;
  totalCorrect: number;
}

export interface QuizStatsByCategory {
  category: string;
  categoryLabel: string;
  answered: number;
  correct: number;
}

export interface QuizStatsByDifficulty {
  difficulty: string;
  answered: number;
  correct: number;
}

export interface QuizStats {
  totalAnswered: number;
  totalCorrect: number;
  correctRate: number;
  byCategory: QuizStatsByCategory[];
  byDifficulty: QuizStatsByDifficulty[];
}

export interface QuizHistoryItem {
  id: number;
  quizId: number;
  quizCode: string;
  question: string;
  selectedIndex: number;
  answerIndex: number;
  isCorrect: boolean;
  answeredAt: string;
}

export interface QuizFetchParams {
  category?: string;
  difficulty?: QuizDifficulty | string;
  limit?: number;
  random?: boolean;
}

// 表示用ラベル
export const CATEGORY_LABELS: Record<string, string> = {
  attraction_basic: 'アトラクション基本',
  trivia: 'アトラクション豆知識',
  area: 'エリア・施設',
  show: 'ショー・パレード',
  restaurant: 'レストラン・フード',
  character: 'キャラクター',
  ticket_pass: 'チケット・パス',
  tips: '攻略・お得情報',
  history: '歴史・運営',
  seasonal: 'シーズンイベント',
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

export const CATEGORY_ORDER: QuizCategory[] = [
  'attraction_basic',
  'trivia',
  'area',
  'show',
  'restaurant',
  'character',
  'ticket_pass',
  'tips',
  'history',
  'seasonal',
];

export const DIFFICULTY_ORDER: QuizDifficulty[] = ['beginner', 'intermediate', 'advanced'];
