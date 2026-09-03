export const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';

export interface ParkEvent {
  id: number;
  date: string;
  end_date: string | null;
  name: string;
  summary: string | null;
  category: 'event' | 'private' | 'other';
  sub_category: 'event' | 'attraction' | 'show';
  official_url: string | null;
  location: string | null;
  duration: string | null;
  age_restriction: string | null;
  source_image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface EventsResponse {
  events: ParkEvent[];
  count: number;
}

let cachedEvents: ParkEvent[] | null = null;
let fetchPromise: Promise<ParkEvent[]> | null = null;

export async function fetchEvents(dateFrom?: string, dateTo?: string): Promise<ParkEvent[]> {
  const params = new URLSearchParams();
  if (dateFrom) params.set('date_from', dateFrom);
  if (dateTo) params.set('date_to', dateTo);
  const qs = params.toString();
  const url = `${AUTH_BASE}/events${qs ? `?${qs}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Events API Error: ${res.status}`);
  const data: EventsResponse = await res.json();
  return data.events;
}

export async function fetchAllEvents(): Promise<ParkEvent[]> {
  if (cachedEvents) return cachedEvents;
  if (fetchPromise) return fetchPromise;

  // 直近の過去（昨日終わった貸切など）もカレンダーで見られるよう約1ヶ月前から取得
  const from = new Date();
  from.setDate(from.getDate() - 31);
  const dateFrom = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;

  fetchPromise = fetchEvents(dateFrom)
    .then(events => {
      cachedEvents = events;
      return events;
    })
    .catch(err => {
      console.error('Failed to load events:', err);
      fetchPromise = null;
      return [];
    });

  return fetchPromise;
}

// イベントが指定日に該当するか（期間対応）
function isEventOnDate(event: ParkEvent, date: string): boolean {
  if (event.end_date) {
    return date >= event.date && date <= event.end_date;
  }
  return event.date === date;
}

// イベントタブ用: 初日または最終日のみ該当
export function isEventStartOrEnd(event: ParkEvent, date: string): boolean {
  if (event.date === date) return true;
  if (event.end_date && event.end_date === date) return true;
  return false;
}

export function getEventsForDate(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => isEventOnDate(e, date));
}

// イベントタブ用: 全種別の初日・最終日のみ
export function getEventStartEndForDate(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => e.category !== 'private' && isEventStartOrEnd(e, date));
}

// カレンダーセル用: イベントタブで表示する日（初日or最終日）
export function hasEventStartOrEndOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => e.category !== 'private' && isEventStartOrEnd(e, date));
}

export function hasEventOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => isEventOnDate(e, date));
}

export function hasPrivateEventOnDate(events: ParkEvent[], date: string): boolean {
  return events.some(e => isEventOnDate(e, date) && e.category === 'private');
}

// 期間限定イベント（初日・最終日以外）: 期間中で開催中のもの
export function getOngoingLimitedEvents(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e =>
    e.category !== 'private' &&
    e.end_date &&
    date > e.date &&
    date < e.end_date
  );
}

// 単発イベント: end_dateなしでその日に該当
export function getSingleDayEvents(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => !e.end_date && e.date === date && e.category !== 'private');
}

// テーマ定義
export interface EventTheme {
  id: string;
  label: string;
  sublabel?: string;
  emoji: string;
  keywords: string[];
}

const EVENT_THEMES: EventTheme[] = [
  { id: 'summer2026', label: '2026年夏イベント', sublabel: '(ユニバーサル・サマー・マツリ・ナイト ～ネオン・グロウアップ～)', emoji: '🏮', keywords: ['マツリ', 'BOO-YA', 'ネオンサマー', 'サマーナイト', 'サマービート', 'サマー・グロウ', 'クール・グリーン・ストリート', 'クールダウン・ステーション'] },
  { id: '25th', label: '25周年 Discover U!!!', emoji: '🎂', keywords: ['Discover U', '25周年', 'Back to 2001', 'NO LIMIT! パレード', '周年ソング', 'カーズ・アンド・スターズ'] },
  { id: 'cooljapan', label: 'COOL JAPAN', emoji: '🇯🇵', keywords: ['コナン', '呪術廻戦', 'フリーレン', 'マスカレード', '東野圭吾'] },
  { id: 'jurassic', label: 'ジュラシック・ワールド', emoji: '🦖', keywords: ['ジュラシック'] },
  { id: 'harrypotter', label: 'ハリー・ポッター', emoji: '⚡', keywords: ['バタービール', 'ホグワーツ', 'ハリー・ポッター'] },
  { id: 'monsterhunter', label: 'モンスターハンター', emoji: '⚔️', keywords: ['モンスターハンター', 'モリバーの宴'] },
  { id: 'wicked', label: 'ウィキッド', emoji: '🧙‍♀️', keywords: ['ウィキッド'] },
];

// イベント名からテーマIDを判定
export function getEventTheme(event: ParkEvent): string {
  for (const theme of EVENT_THEMES) {
    if (theme.keywords.some(kw => event.name.includes(kw))) {
      return theme.id;
    }
  }
  return 'other';
}

// テーマ情報を取得
export function getThemeInfo(themeId: string): EventTheme {
  return EVENT_THEMES.find(t => t.id === themeId) || { id: 'other', label: 'その他', emoji: '📌', keywords: [] };
}

// テーマ内の表示順（name部分一致、順番通り。該当なしは末尾）
const THEME_EVENT_ORDER: Record<string, string[]> = {
  cooljapan: [
    'コナン・ザ・エスケープ',
    'コナン・ミステリー・レストラン',
    'コナン×ストーリー・ライド',
    'コナン・クイズラリー',
    '呪術廻戦・ザ・リアル',
    '呪術廻戦×ストーリー・ライド',
    'モリバーの宴',
    'マスカレード',
    'フリーレン ストーリー・ウォーク',
    'フリーレン×ストーリー・ライド',
    'フリーレン ～追憶のレストラン～',
  ],
};

function sortEventsInTheme(themeId: string, events: ParkEvent[]): ParkEvent[] {
  const order = THEME_EVENT_ORDER[themeId];
  if (!order) return events;
  return [...events].sort((a, b) => {
    const aIdx = order.findIndex(kw => a.name.includes(kw));
    const bIdx = order.findIndex(kw => b.name.includes(kw));
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });
}

// イベントをテーマ別にグルーピング
export function groupEventsByTheme(events: ParkEvent[]): { theme: EventTheme; events: ParkEvent[] }[] {
  const groups = new Map<string, ParkEvent[]>();

  for (const event of events) {
    const themeId = getEventTheme(event);
    if (!groups.has(themeId)) groups.set(themeId, []);
    groups.get(themeId)!.push(event);
  }

  // テーマ定義順でソート、otherは最後
  const result: { theme: EventTheme; events: ParkEvent[] }[] = [];
  for (const theme of EVENT_THEMES) {
    const evts = groups.get(theme.id);
    if (evts && evts.length > 0) {
      result.push({ theme, events: sortEventsInTheme(theme.id, evts) });
    }
  }
  const otherEvts = groups.get('other');
  if (otherEvts && otherEvts.length > 0) {
    result.push({ theme: { id: 'other', label: 'その他', emoji: '📌', keywords: [] }, events: otherEvts });
  }
  return result;
}

// 今後のイベント: 開始日がtodayより未来のもの（開始日昇順）
export function getUpcomingEvents(events: ParkEvent[], today: string): ParkEvent[] {
  return events
    .filter(e => e.category !== 'private' && e.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 2026ハロウィーン特設セクション対象イベント（DB登録名と完全一致・この順で表示）
export const HALLOWEEN_2026_EVENT_NAMES: string[] = [
  'ストリート・ゾンビ',
  '『バイオハザード レクイエム』ザ・ダイブ',
  'ゾンビ・デ・ダンス',
  'プレイバック・ゾンビ・デ・ダンス ～ハロウィーン・ホラー・ナイト 15周年～',
  'ハロウィーン・ホラー・ナイト・アカデミー ～絶叫の15年～',
  '残像',
  'ファクトリー・オブ・フィアー ～絶望のゾンビ・ツアー～',
  '貞子の呪い ～ダーク・ホラー・ライド～',
  'KATE PRESENTS『18番地の魔女 ～感情と戯れる魔女の館～』',
  'チェンソーマン・ザ・カオス 4-D',
  'チェンソーマン × ハリウッド・ドリーム・ザ・ライド ～IRIS OUT～',
  'スマイリーズ・ハッピー・ハロウィーン・グリーティング',
  'ゾンビ・デ・ダンス × ハリウッド・ドリーム・ザ・ライド',
  'ジョーズ ～レッド・アラート～',
  'ジュラシック・パーク・ザ・ライド ～イン・ザ・ダーク～',
  'ホグワーツ・キャッスルウォーク',
  'ミニオン・ベロウィーン・グリーティング',
  'パーク中で「トリック・オア・トリート」',
  'スーパー・ニンテンドー・ワールド5周年 ミート＆グリート',
  'パワーアップバンド・キーチャレンジ ～みんなで無敵の5周年バージョン～',
];

// 名前の完全一致（「ゾンビ・デ・ダンス」が他の名前の部分文字列のため部分一致は不可）
export function isHalloween2026Event(e: ParkEvent): boolean {
  return HALLOWEEN_2026_EVENT_NAMES.includes(e.name);
}

// 該当イベントを HALLOWEEN_2026_EVENT_NAMES の順にソートして返す
export function getHalloween2026Events(events: ParkEvent[]): ParkEvent[] {
  return events
    .filter(isHalloween2026Event)
    .sort((a, b) => HALLOWEEN_2026_EVENT_NAMES.indexOf(a.name) - HALLOWEEN_2026_EVENT_NAMES.indexOf(b.name));
}

// 期間限定アトラクション: 期間中のもの
export function getLimitedAttractions(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => e.sub_category === 'attraction' && isEventOnDate(e, date));
}

// 期間限定ショー: 期間中のもの
export function getLimitedShows(events: ParkEvent[], date: string): ParkEvent[] {
  return events.filter(e => e.sub_category === 'show' && isEventOnDate(e, date));
}
