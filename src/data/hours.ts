// 営業時間データ（動的fetch）
const DATA_URL = `${import.meta.env.BASE_URL}data/park-hours.json`;

let cachedHours: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;

export async function fetchParkHours(): Promise<Record<string, string>> {
  if (cachedHours) return cachedHours;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch(DATA_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch park hours: ${res.status}`);
      return res.json();
    })
    .then(data => {
      cachedHours = data;
      return data;
    })
    .catch(err => {
      console.error('Failed to load park hours:', err);
      fetchPromise = null;
      return {};
    });

  return fetchPromise;
}
