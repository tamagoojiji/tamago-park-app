// API設定 - Phase 1: GAS / Phase 2: VPS(Python)に切替時はここだけ変更
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiConfig = {
  baseUrl: API_BASE_URL,
};

// 共通fetchラッパー（将来のバックエンド切替に対応）
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
