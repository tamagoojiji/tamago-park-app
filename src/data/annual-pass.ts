// 年パス除外日データ（動的fetch）
const DATA_URL = `${import.meta.env.BASE_URL}data/annual-pass.json`;

let cachedDates: Set<string> | null = null;
let fetchPromise: Promise<Set<string>> | null = null;

export async function fetchAnnualPassExcluded(): Promise<Set<string>> {
  if (cachedDates) return cachedDates;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch annual pass: ${res.status}`);
      return res.json();
    })
    .then((data: string[]) => {
      cachedDates = new Set(data);
      return cachedDates;
    })
    .catch(err => {
      console.error('Failed to load annual pass:', err);
      fetchPromise = null;
      return new Set<string>();
    });

  return fetchPromise;
}

// カレンダー表示用: 除外日なら "除外日" を返す
export function getAnnualPassStatus(excluded: Set<string>, date: string): string {
  if (excluded.has(date)) return '除外日';
  return '利用可';
}
