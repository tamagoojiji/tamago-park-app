// アトラクション休止情報データ（動的fetch）
export interface ClosureEntry {
  name: string;
  period: string;
  start: string | null; // YYYY-MM-DD
  end: string | null;   // YYYY-MM-DD or null（当面の間）
}

export interface ClosuresData {
  updated: string;
  closures: ClosureEntry[];
}

const DATA_URL = `${import.meta.env.BASE_URL}data/closures.json`;

let cachedData: ClosuresData | null = null;
let fetchPromise: Promise<ClosuresData> | null = null;

export async function fetchClosures(): Promise<ClosuresData> {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch closures: ${res.status}`);
      return res.json();
    })
    .then(data => {
      cachedData = data;
      return data;
    })
    .catch(err => {
      console.error('Failed to load closures:', err);
      fetchPromise = null;
      return { updated: '', closures: [] };
    });

  return fetchPromise;
}

/** 指定日に休止中のアトラクションを返す */
export function getClosuresForDate(data: ClosuresData, dateStr: string): ClosureEntry[] {
  return data.closures.filter(c => {
    if (!c.start) return false;
    if (c.start > dateStr) return false;
    if (c.end && c.end < dateStr) return false;
    return true;
  });
}

/** 指定月に休止があるアトラクション数を返す */
export function getClosureCountForMonth(data: ClosuresData, year: number, month: number): Map<string, number> {
  const counts = new Map<string, number>();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const count = getClosuresForDate(data, dateStr).length;
    if (count > 0) counts.set(dateStr, count);
  }

  return counts;
}
