import type { MyPlan } from '../types/myplan';

const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

async function myplanFetch<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${AUTH_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
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

export const myplanApi = {
  create(token: string, plan: MyPlan) {
    return myplanFetch<{ success: boolean; id: number }>('/myplan', token, {
      method: 'POST',
      body: JSON.stringify({
        name: plan.name,
        date: plan.date,
        attractions: plan.attractions,
        shows: plan.shows,
        openTime: plan.openTime,
        closeTime: plan.closeTime,
        memo: plan.memo,
      }),
    });
  },

  list(token: string) {
    return myplanFetch<{ plans: (MyPlan & { id: number })[] }>('/myplan', token);
  },

  get(token: string, id: number) {
    return myplanFetch<MyPlan & { id: number }>(`/myplan/${id}`, token);
  },

  update(token: string, id: number, plan: MyPlan) {
    return myplanFetch<{ success: boolean }>(`/myplan/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(plan),
    });
  },

  delete(token: string, id: number) {
    return myplanFetch<{ success: boolean }>(`/myplan/${id}`, token, {
      method: 'DELETE',
    });
  },
};
