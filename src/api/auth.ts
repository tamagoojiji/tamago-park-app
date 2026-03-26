import type { AuthResponse, User } from '../types';

const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

async function authFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${AUTH_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API Error: ${res.status}`);
  }

  return res.json();
}

export const authApi = {
  lineLogin(accessToken: string) {
    return authFetch<AuthResponse>('/auth/line', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    });
  },

  getMe(token: string) {
    return authFetch<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateProfile(token: string, birthday: string, gender: string) {
    return authFetch<AuthResponse>('/auth/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ birthday, gender }),
    });
  },
};
