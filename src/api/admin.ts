const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';
const ADMIN_TOKEN_KEY = 'tamago_park_admin_token';

function getAdminToken(): string {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function hasAdminToken(): boolean {
  return !!localStorage.getItem(ADMIN_TOKEN_KEY);
}

async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const { headers: optHeaders, ...rest } = options || {};
  const res = await fetch(`${AUTH_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(optHeaders as Record<string, string>),
    },
    ...rest,
  });
  if (res.status === 401 || res.status === 403) {
    clearAdminToken();
    throw new Error('認証エラー');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API Error: ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  async login(password: string) {
    const res = await fetch(`${AUTH_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || 'ログイン失敗');
    }
    return res.json() as Promise<{ success: boolean; token: string }>;
  },

  stats() {
    return adminFetch<{
      users: number; surveys: number; plans: number; events: number;
      todayShows: number; todaySurveys: number; todayPlans: number;
    }>('/admin/stats');
  },

  users(page = 1, limit = 50, search = '') {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    return adminFetch<{ users: Record<string, unknown>[]; total: number; page: number; limit: number }>(
      `/admin/users?${params}`
    );
  },

  userDetail(id: number) {
    return adminFetch<{ user: Record<string, unknown>; surveys: Record<string, unknown>[]; plans: Record<string, unknown>[] }>(
      `/admin/users/${id}`
    );
  },

  surveys(page = 1, limit = 50, dateFrom = '', dateTo = '', status = '') {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    if (status) params.set('status', status);
    return adminFetch<{ surveys: Record<string, unknown>[]; total: number; page: number; limit: number }>(
      `/admin/surveys?${params}`
    );
  },

  surveyDetail(id: number) {
    return adminFetch<Record<string, unknown>>(`/admin/surveys/${id}`);
  },

  shows(dateFrom = '', dateTo = '') {
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    const qs = params.toString();
    return adminFetch<{ shows: Record<string, { name: string; times: string[] }[]>; totalDates: number }>(
      `/admin/shows${qs ? `?${qs}` : ''}`
    );
  },

  fetchShows() {
    return adminFetch<{ success: boolean; dates: Record<string, number>; totalDays: number }>(
      '/admin/shows/fetch', { method: 'POST' }
    );
  },

  events(dateFrom = '', dateTo = '', category = '') {
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    if (category) params.set('category', category);
    const qs = params.toString();
    return adminFetch<{ events: Record<string, unknown>[]; count: number }>(
      `/admin/events${qs ? `?${qs}` : ''}`
    );
  },

  createEvent(data: { date: string; end_date?: string; name: string; summary?: string; category?: string; source_image_url?: string }) {
    return adminFetch<{ success: boolean; id: number }>('/admin/events', {
      method: 'POST', body: JSON.stringify(data),
    });
  },

  updateEvent(id: number, data: Record<string, unknown>) {
    return adminFetch<{ success: boolean }>(`/admin/events/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    });
  },

  deleteEvent(id: number) {
    return adminFetch<{ success: boolean }>(`/admin/events/${id}`, { method: 'DELETE' });
  },
};
