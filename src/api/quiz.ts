import type {
  Quiz,
  QuizAdmin,
  QuizAnswerResponse,
  QuizStats,
  QuizHistoryItem,
  QuizFetchParams,
} from '../types/quiz';

const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';
const ADMIN_TOKEN_KEY = 'tamago_park_admin_token';

function getAdminToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

async function quizFetch<T>(
  endpoint: string,
  options?: RequestInit & { token?: string; admin?: boolean }
): Promise<T> {
  const { token, admin, headers: optHeaders, ...rest } = options || {};
  const authToken = admin ? getAdminToken() : token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(optHeaders as Record<string, string>),
  };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${AUTH_BASE}${endpoint}`, { headers, ...rest });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API Error: ${res.status}`);
  }
  return res.json();
}

// 公開API
export async function fetchQuizzes(params?: QuizFetchParams): Promise<Quiz[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.difficulty) qs.set('difficulty', params.difficulty);
  if (params?.limit !== undefined) qs.set('limit', String(params.limit));
  if (params?.random !== undefined) qs.set('random', String(params.random));
  const query = qs.toString();
  const res = await quizFetch<{ quizzes: Quiz[] }>(`/quiz${query ? `?${query}` : ''}`);
  return res.quizzes;
}

// ユーザー認証必須API
export function submitAnswer(
  quizId: number,
  selectedIndex: number,
  token: string
): Promise<QuizAnswerResponse> {
  return quizFetch<QuizAnswerResponse>(`/quiz/${quizId}/answer`, {
    method: 'POST',
    token,
    body: JSON.stringify({ selectedIndex }),
  });
}

export function fetchStats(token: string): Promise<QuizStats> {
  return quizFetch<QuizStats>('/quiz/me/stats', { token });
}

export function fetchHistory(token: string, limit = 50): Promise<QuizHistoryItem[]> {
  return quizFetch<{ history: QuizHistoryItem[] }>(`/quiz/me/history?limit=${limit}`, {
    token,
  }).then((r) => r.history);
}

// 管理者向けAPI
export interface QuizAdminFilter {
  category?: string;
  difficulty?: string;
  status?: string;
}

export function fetchAdminQuizzes(filter?: QuizAdminFilter): Promise<QuizAdmin[]> {
  const qs = new URLSearchParams();
  if (filter?.category) qs.set('category', filter.category);
  if (filter?.difficulty) qs.set('difficulty', filter.difficulty);
  if (filter?.status) qs.set('status', filter.status);
  const query = qs.toString();
  return quizFetch<{ quizzes: QuizAdmin[] }>(
    `/admin/quizzes${query ? `?${query}` : ''}`,
    { admin: true }
  ).then((r) => r.quizzes);
}

export interface QuizCreatePayload {
  code: string;
  category: string;
  categoryLabel: string;
  difficulty: string;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation?: string | null;
  needsReview?: boolean;
  status?: string;
}

export type QuizUpdatePayload = Partial<QuizCreatePayload>;

export function createQuiz(data: QuizCreatePayload): Promise<{ id: number; code: string }> {
  return quizFetch<{ id: number; code: string }>('/admin/quizzes', {
    method: 'POST',
    admin: true,
    body: JSON.stringify(data),
  });
}

export function updateQuiz(quizId: number, data: QuizUpdatePayload): Promise<{ success: boolean }> {
  return quizFetch<{ success: boolean }>(`/admin/quizzes/${quizId}`, {
    method: 'PUT',
    admin: true,
    body: JSON.stringify(data),
  });
}

export function deleteQuiz(quizId: number): Promise<{ success: boolean }> {
  return quizFetch<{ success: boolean }>(`/admin/quizzes/${quizId}`, {
    method: 'DELETE',
    admin: true,
  });
}

export function importQuizzes(
  quizzes: QuizCreatePayload[],
  replace = false
): Promise<{ inserted: number; skipped: number }> {
  return quizFetch<{ inserted: number; skipped: number }>('/admin/quizzes/import', {
    method: 'POST',
    admin: true,
    body: JSON.stringify({ quizzes, replace }),
  });
}
