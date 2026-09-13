const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ShowData {
  name: string;
  times: string[]; // ["09:00", "12:30", ...]
  endTime?: string; // "18:00" — 随時運行ショーの終了時間
}

export interface ShowsResult {
  shows: ShowData[];
  scheduleDate: string; // "2026-03-30"
  availableDates: string[]; // ["2026-03-30", "2026-03-31", ...]
}

interface ShowsResponse {
  shows: ShowData[];
  count: number;
  scheduleDate: string;
  availableDates: string[];
}

export async function fetchShows(date?: string): Promise<ShowsResult> {
  const url = date
    ? `${AUTH_BASE}/shows?date=${date}`
    : `${AUTH_BASE}/shows`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Shows API Error: ${res.status}`);
  }
  const data: ShowsResponse = await res.json();
  return {
    shows: data.shows,
    scheduleDate: data.scheduleDate,
    availableDates: data.availableDates,
  };
}

// 「ゾンビ・デ・ダンス」が他ショー名の部分文字列のため、完全一致を優先し部分一致は片方向のみ（™®・空白の表記ゆれは無視）
export function findShow(list: ShowData[], name: string): ShowData | undefined {
  const norm = (s: string) => s.replace(/[™®\s]/g, '');
  const target = norm(name);
  return list.find((s) => norm(s.name) === target) ?? list.find((s) => norm(s.name).includes(target));
}

// ハロウィーンの夜ショーは閉園時刻（21:30/22:00）で公演回数が変わるため、閉園時刻一致を優先
export function pickFallbackDate(
  availableDates: string[],
  primaryDate: string,
  parkHours: Record<string, string>,
): string | undefined {
  const closeOf = (d: string) => parkHours[d]?.split('~')[1];
  const targetDay = new Date(primaryDate).getDay();
  const candidates = availableDates.filter((d) => d < primaryDate);

  const primaryClose = closeOf(primaryDate);
  if (primaryClose) {
    const sameClose = candidates.filter((d) => closeOf(d) === primaryClose);
    if (sameClose.length > 0) {
      return (
        sameClose.filter((d) => new Date(d).getDay() === targetDay).sort().pop() ??
        sameClose.slice().sort().pop()
      );
    }
  }
  return candidates.filter((d) => new Date(d).getDay() === targetDay).sort().pop();
}
