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
  register(email: string, pin: string) {
    return authFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, pin }),
    });
  },

  login(email: string, pin: string) {
    return authFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, pin }),
    });
  },

  resetPin(email: string) {
    return authFetch<AuthResponse>('/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getMe(token: string) {
    return authFetch<User>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
