import { useState, useCallback } from 'react';

const STORAGE_KEY = 'park_app_show_favorites';

function loadFavorites(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

export function useShowFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  const isFav = useCallback(
    (name: string) => favorites.includes(name),
    [favorites],
  );

  const toggleFav = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Quota超過・ストレージ無効化等 — メモリ上の状態のみ更新
      }
      return next;
    });
  }, []);

  return { isFav, toggleFav };
}
