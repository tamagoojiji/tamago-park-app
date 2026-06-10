import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { adminApi } from '../../api/admin';
import { CROWD_LEVEL_LABEL, CROWD_LEVEL_COLOR } from '../../api/crowd';
import { fetchEvents, type ParkEvent } from '../../api/events';
import { fetchClosures, type ClosuresData } from '../../data/closures';
import styles from './Admin.module.css';

type Day = Awaited<ReturnType<typeof adminApi.crowd>>['days'][number];
type SortMode = 'date' | 'diff';

// その日に「始まる/終わる」予定（イベント開始・終了 / アトラクション休止開始・最終日）
type Scheduled = { kind: 'start' | 'end' | 'closeStart' | 'closeEnd'; icon: string; label: string; title: string };

const SCHEDULE_COLOR: Record<Scheduled['kind'], string> = {
  start: '#1d4ed8',      // 開始: 青
  end: '#6b7280',        // 終了: グレー
  closeStart: '#b91c1c', // 休止開始: 赤
  closeEnd: '#15803d',   // 休止最終日(翌日再開): 緑
};

function eventIcon(e: ParkEvent): string {
  if (e.category === 'private') return '🎪';
  return e.sub_category === 'attraction' ? '🎢' : e.sub_category === 'show' ? '🎭' : '🎉';
}

function getScheduleForDate(date: string, events: ParkEvent[], closures: ClosuresData | null): Scheduled[] {
  const out: Scheduled[] = [];
  for (const e of events) {
    if (e.date === date) out.push({ kind: 'start', icon: `🆕${eventIcon(e)}`, label: e.name, title: `開始: ${e.name}` });
    if (e.end_date && e.end_date === date && e.end_date !== e.date) {
      out.push({ kind: 'end', icon: `🏁${eventIcon(e)}`, label: e.name, title: `終了: ${e.name}` });
    }
  }
  if (closures) {
    for (const c of closures.closures) {
      if (c.start === date) out.push({ kind: 'closeStart', icon: '🔒', label: c.name, title: `休止開始: ${c.name}（${c.period}）` });
      if (c.end === date && c.end !== c.start) {
        out.push({ kind: 'closeEnd', icon: '🔓', label: c.name, title: `休止最終日・翌日再開: ${c.name}（${c.period}）` });
      }
    }
  }
  return out;
}

const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const addDays = (iso: string, days: number) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const weekday = (iso: string) => ['日', '月', '火', '水', '木', '金', '土'][new Date(iso + 'T00:00:00').getDay()];

const LevelBadge = ({ level }: { level: number | null }) => {
  if (!level) return <span style={{ color: '#9ca3af', fontSize: '0.9em' }}>—</span>;
  return (
    <span style={{
      display: 'inline-block',
      minWidth: 22,
      padding: '2px 6px',
      background: CROWD_LEVEL_COLOR[level],
      color: '#fff',
      borderRadius: 4,
      fontWeight: 700,
      fontSize: '0.9em',
      textAlign: 'center',
    }}>{level}</span>
  );
};

const LevelSelect = ({ value, autoValue, onChange, disabled }: {
  value: number | null;
  autoValue: number | null;
  onChange: (v: number | null) => void;
  disabled?: boolean;
}) => (
  <select
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
    disabled={disabled}
    style={{
      width: 64,
      padding: '2px 4px',
      borderRadius: 4,
      border: value !== null ? '2px solid #3b82f6' : '1px solid #d1d5db',
      background: value !== null && CROWD_LEVEL_COLOR[value] ? `${CROWD_LEVEL_COLOR[value]}22` : '#fff',
      fontWeight: value !== null ? 700 : 400,
    }}
  >
    <option value="">— ({autoValue ?? '?'})</option>
    {[1, 2, 3, 4, 5].map((n) => (
      <option key={n} value={n}>{n} {CROWD_LEVEL_LABEL[n]}</option>
    ))}
  </select>
);

// 画面幅でスマホ/PCを判定（768px未満をスマホ扱い）
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export default function AdminCrowdPage() {
  const isMobile = useIsMobile();
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(addDays(todayIso(), 365));
  const [days, setDays] = useState<Day[]>([]);
  const [events, setEvents] = useState<ParkEvent[]>([]);
  const [closures, setClosures] = useState<ClosuresData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [diffOnly, setDiffOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, evs] = await Promise.all([
        adminApi.crowd(from, to),
        fetchEvents(from, to),
      ]);
      setDays(res.days);
      setEvents(evs);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchClosures().then(setClosures); }, []);

  const updateLocal = useCallback((date: string, patch: Partial<Day>) => {
    setDays((prev) => prev.map((d) => d.date === date ? {
      ...d, ...patch,
      day_diff: (patch.manual_day_level !== undefined ? patch.manual_day_level : d.manual_day_level) !== null
        ? ((patch.manual_day_level !== undefined ? patch.manual_day_level : d.manual_day_level)! - d.auto_day_level!)
        : null,
    } : d));
  }, []);

  const displayed = useMemo(() => {
    let list = [...days];
    if (diffOnly) list = list.filter((d) => d.day_diff !== null && Math.abs(d.day_diff) >= 1);
    if (sortMode === 'diff') {
      list.sort((a, b) => Math.abs(b.day_diff ?? 0) - Math.abs(a.day_diff ?? 0));
    }
    return list;
  }, [days, sortMode, diffOnly]);

  const scheduleMap = useMemo(() => {
    const m = new Map<string, Scheduled[]>();
    for (const d of days) m.set(d.date, getScheduleForDate(d.date, events, closures));
    return m;
  }, [days, events, closures]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>混雑予想 管理（インライン編集）</h1>

      <div className={styles.controls} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <label>From <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>To <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        <button onClick={load}>再読込</button>
        <label><input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} /> 差分ありのみ</label>
        <label>並び順:&nbsp;
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
            <option value="date">日付順</option>
            <option value="diff">差分大きい順</option>
          </select>
        </label>
        <span style={{ color: '#6b7280', fontSize: '0.85em' }}>※セルを変更すると自動保存されます</span>
      </div>

      {error && <div style={{ color: 'red', padding: 8 }}>{error}</div>}
      {loading && <div>読み込み中...</div>}

      <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
        <thead style={{ position: 'sticky', top: 0, background: '#f3f4f6' }}>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>
            {isMobile ? (
              <>
                <th style={{ padding: '6px 8px' }}>日付</th>
                <th style={{ padding: '6px 4px' }}>自動</th>
                <th style={{ padding: '6px 4px' }}>手動</th>
                <th style={{ padding: '6px 6px' }}>予定</th>
                <th style={{ padding: '6px 4px' }}></th>
              </>
            ) : (
              <>
                <th style={{ padding: '6px 8px' }}>日付</th>
                <th style={{ padding: '6px 8px' }}>曜</th>
                <th style={{ padding: '6px 8px' }}>自動</th>
                <th style={{ padding: '6px 8px' }}>手動</th>
                <th style={{ padding: '6px 8px' }}>差</th>
                <th style={{ padding: '6px 8px' }}>予定（開始/終了/休止）</th>
                <th style={{ padding: '6px 8px' }}>メモ</th>
                <th style={{ padding: '6px 8px' }}></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {displayed.map((d) => (
            <CrowdRow key={d.date} day={d} schedule={scheduleMap.get(d.date) ?? []} compact={isMobile} onLocalUpdate={updateLocal} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CrowdRow({ day, schedule, compact, onLocalUpdate }: { day: Day; schedule: Scheduled[]; compact: boolean; onLocalUpdate: (date: string, patch: Partial<Day>) => void }) {
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [noteLocal, setNoteLocal] = useState(day.manual_note ?? '');
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setNoteLocal(day.manual_note ?? ''); }, [day.manual_note]);

  const saveOverride = async (patch: { day_level?: number | null; am_level?: number | null; pm_level?: number | null; note?: string | null }) => {
    setSaving(true);
    setRowError(null);
    try {
      const payload = {
        day_level: patch.day_level !== undefined ? patch.day_level : day.manual_day_level,
        am_level: patch.am_level !== undefined ? patch.am_level : day.manual_am_level,
        pm_level: patch.pm_level !== undefined ? patch.pm_level : day.manual_pm_level,
        note: patch.note !== undefined ? patch.note : day.manual_note,
      };
      // 全部nullなら APIは DELETE 相当（クリア）として扱う
      if (payload.day_level === null && payload.am_level === null && payload.pm_level === null && !payload.note) {
        await adminApi.clearCrowdOverride(day.date);
      } else {
        await adminApi.overrideCrowd(day.date, payload);
      }
      onLocalUpdate(day.date, {
        manual_day_level: payload.day_level,
        manual_am_level: payload.am_level,
        manual_pm_level: payload.pm_level,
        manual_note: payload.note,
      });
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    } catch (e) {
      setRowError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  const onNoteChange = (v: string) => {
    setNoteLocal(v);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => {
      saveOverride({ note: v.trim() || null });
    }, 600);
  };

  const wdColor = weekday(day.date) === '土' ? '#3b82f6' : weekday(day.date) === '日' ? '#ef4444' : '#374151';

  const scheduleInner = schedule.length === 0
    ? <span style={{ color: '#d1d5db' }}>—</span>
    : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {schedule.map((s, i) => (
          <span key={i} title={s.title} style={{ display: 'flex', gap: 4, alignItems: 'baseline', lineHeight: 1.3, color: SCHEDULE_COLOR[s.kind] }}>
            <span style={{ flexShrink: 0 }}>{s.icon}</span>
            <span style={{ wordBreak: 'break-word' }}>{s.label}</span>
          </span>
        ))}
      </div>
    );

  const noteInput = (
    <input
      value={noteLocal}
      onChange={(e) => onNoteChange(e.target.value)}
      placeholder="メモ"
      style={{ width: '100%', minWidth: 120, padding: 4, border: '1px solid #d1d5db', borderRadius: 4 }}
    />
  );

  if (compact) {
    const shortDate = `${Number(day.date.slice(5, 7))}/${Number(day.date.slice(8, 10))}`;
    const scheduleSummary = schedule.length === 0
      ? <span style={{ color: '#d1d5db' }}>—</span>
      : (
        <span title={schedule.map((s) => s.title).join('\n')} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: SCHEDULE_COLOR[schedule[0].kind] }}>
          {schedule[0].icon} {schedule[0].label}{schedule.length > 1 ? ` 他${schedule.length - 1}` : ''}
        </span>
      );
    return (
      <>
        <tr onClick={() => setExpanded((e) => !e)}
          style={{ borderBottom: expanded ? 'none' : '1px solid #e5e7eb', background: savedFlash ? '#dcfce7' : (saving ? '#fef3c7' : 'transparent'), transition: 'background 0.3s', cursor: 'pointer' }}>
          <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
            <span style={{ fontWeight: 600 }}>{shortDate}</span>
            <span style={{ color: wdColor, fontWeight: 600, marginLeft: 4 }}>({weekday(day.date)})</span>
          </td>
          <td style={{ padding: '8px 4px', textAlign: 'center' }}><LevelBadge level={day.auto_day_level} /></td>
          <td style={{ padding: '8px 2px' }} onClick={(e) => e.stopPropagation()}>
            <LevelSelect value={day.manual_day_level} autoValue={day.auto_day_level} disabled={saving}
              onChange={(v) => saveOverride({ day_level: v })} />
          </td>
          <td style={{ padding: '8px 6px', maxWidth: 120, fontSize: '0.8em', overflow: 'hidden' }}>{scheduleSummary}</td>
          <td style={{ padding: '8px 4px', color: '#9ca3af', whiteSpace: 'nowrap', textAlign: 'center' }}>
            {saving ? '…' : savedFlash ? '✓' : (expanded ? '▲' : '▼')}
          </td>
        </tr>
        {expanded && (
          <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <td colSpan={5} style={{ padding: '8px 12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9em' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>差（手動−自動）: </span>
                  <span style={{ fontWeight: 700, color: day.day_diff && day.day_diff > 0 ? '#ef4444' : day.day_diff && day.day_diff < 0 ? '#22c55e' : '#9ca3af' }}>
                    {day.day_diff !== null ? (day.day_diff > 0 ? `+${day.day_diff}` : `${day.day_diff}`) : '—'}
                  </span>
                  {rowError && <span style={{ color: '#ef4444', marginLeft: 8 }} title={rowError}>⚠️ 保存失敗</span>}
                </div>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: 3 }}>予定（開始/終了/休止）</div>
                  {scheduleInner}
                </div>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: 3 }}>メモ</div>
                  {noteInput}
                </div>
                {day.auto_breakdown && Object.keys(day.auto_breakdown).length > 0 && (
                  <details>
                    <summary style={{ cursor: 'pointer', color: '#6b7280' }}>内訳</summary>
                    <pre style={{ background: '#fff', border: '1px solid #d1d5db', padding: 8, fontSize: '0.85em', overflow: 'auto', marginTop: 4 }}>
                      {Object.entries(day.auto_breakdown).map(([k, v]) => `${k}: ${v}`).join('\n')}
                    </pre>
                  </details>
                )}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  }

  return (
    <tr style={{ borderBottom: '1px solid #e5e7eb', background: savedFlash ? '#dcfce7' : (saving ? '#fef3c7' : 'transparent'), transition: 'background 0.3s' }}>
      <td style={{ padding: '4px 8px', whiteSpace: 'nowrap' }}>{day.date}</td>
      <td style={{ padding: '4px 8px', color: wdColor, fontWeight: 600 }}>{weekday(day.date)}</td>
      <td style={{ padding: '4px 4px' }}><LevelBadge level={day.auto_day_level} /></td>
      <td style={{ padding: '4px 2px' }}>
        <LevelSelect value={day.manual_day_level} autoValue={day.auto_day_level} disabled={saving}
          onChange={(v) => saveOverride({ day_level: v })} />
      </td>
      <td style={{ padding: '4px 4px', fontWeight: 700, textAlign: 'center',
        color: day.day_diff && day.day_diff > 0 ? '#ef4444' : day.day_diff && day.day_diff < 0 ? '#22c55e' : '#9ca3af' }}>
        {day.day_diff !== null ? (day.day_diff > 0 ? `+${day.day_diff}` : `${day.day_diff}`) : '—'}
      </td>
      <td style={{ padding: '4px 6px', fontSize: '0.78em', minWidth: 200, maxWidth: 320, verticalAlign: 'top' }}>
        {scheduleInner}
      </td>
      <td style={{ padding: '4px 4px' }}>
        {noteInput}
      </td>
      <td style={{ padding: '4px 4px', fontSize: '0.8em', whiteSpace: 'nowrap' }}>
        {saving && <span style={{ color: '#d97706' }}>保存中…</span>}
        {savedFlash && <span style={{ color: '#16a34a' }}>✓</span>}
        {rowError && <span style={{ color: '#ef4444' }} title={rowError}>⚠️</span>}
        {day.auto_breakdown && Object.keys(day.auto_breakdown).length > 0 && (
          <details style={{ display: 'inline-block', marginLeft: 6 }}>
            <summary style={{ cursor: 'pointer', color: '#6b7280' }}>内訳</summary>
            <pre style={{ position: 'absolute', background: '#fff', border: '1px solid #d1d5db', padding: 8, fontSize: '0.75em', zIndex: 10, maxWidth: 300, overflow: 'auto' }}>
              {Object.entries(day.auto_breakdown).map(([k, v]) => `${k}: ${v}`).join('\n')}
            </pre>
          </details>
        )}
      </td>
    </tr>
  );
}
