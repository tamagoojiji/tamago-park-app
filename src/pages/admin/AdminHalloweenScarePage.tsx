import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { fetchHalloweenEventsFresh, type ParkEvent } from '../../api/events';
import styles from './AdminHalloweenScare.module.css';

const LEVELS = [1, 2, 3, 4, 5];
// 未反映の入力をブラウザに保持するキー（ログインし直しても消えないように）
const DRAFTS_KEY = 'tamago_park_scare_drafts';

function loadSavedDrafts(): Record<number, Draft> {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFTS_KEY) || '{}');
  } catch {
    return {};
  }
}

const SUB_CATEGORY_LABEL: Record<string, string> = {
  show: 'ショー',
  attraction: 'アトラクション',
  event: 'イベント',
};

interface Draft {
  level: number | null;
  note: string;
}

function formatPeriod(e: ParkEvent): string {
  const fmt = (d: string) => {
    const dt = new Date(d + 'T00:00:00');
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  };
  return e.end_date ? `${fmt(e.date)} 〜 ${fmt(e.end_date)}` : fmt(e.date);
}

function toDraft(e: ParkEvent): Draft {
  return { level: typeof e.scare_level === 'number' ? e.scare_level : null, note: e.scare_note ?? '' };
}

function isDirty(a: Draft, b: Draft): boolean {
  return a.level !== b.level || a.note.trim() !== b.note.trim();
}

export default function AdminHalloweenScarePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<ParkEvent[]>([]);
  const [original, setOriginal] = useState<Record<number, Draft>>({});
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const list = await fetchHalloweenEventsFresh();
      const base: Record<number, Draft> = {};
      list.forEach(e => { base[e.id] = toDraft(e); });
      setEvents(list);
      setOriginal(base);
      // 保存前に離脱（ログインし直し等）した入力があれば復元する
      const saved = loadSavedDrafts();
      const restored: Record<number, Draft> = { ...base };
      list.forEach(e => { if (saved[e.id]) restored[e.id] = saved[e.id]; });
      setDrafts(restored);
    } catch (err) {
      setError('読み込みに失敗しました: ' + String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const dirtyIds = events
    .map(e => e.id)
    .filter(id => original[id] && drafts[id] && isDirty(original[id], drafts[id]));

  // 未反映の入力だけをブラウザに保持（反映済みなら空にする）
  useEffect(() => {
    if (isLoading) return;
    const pending: Record<number, Draft> = {};
    dirtyIds.forEach(id => { pending[id] = drafts[id]; });
    sessionStorage.setItem(DRAFTS_KEY, JSON.stringify(pending));
  }, [drafts, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLevel = (id: number, level: number | null) => {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], level } }));
  };

  const setNote = (id: number, note: string) => {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], note } }));
  };

  const handleSubmit = async () => {
    if (dirtyIds.length === 0) return;
    setSaving(true);
    setError('');
    const count = dirtyIds.length;
    try {
      await adminApi.updateScareLevels(dirtyIds.map(id => ({
        id,
        scare_level: drafts[id].level,
        scare_note: drafts[id].note.trim() === '' ? null : drafts[id].note.trim(),
      })));
      sessionStorage.removeItem(DRAFTS_KEY);
      await load();
      setToast(`反映しました（${count}件）`);
      setTimeout(() => setToast(''), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === '認証エラー') {
        // 入力は sessionStorage に保持済み。ログイン後にこのページへ戻って再度「反映する」を押せる
        sessionStorage.setItem('tamago_park_admin_redirect', '/admin/halloween-scare');
        navigate('/admin', { replace: true });
        return;
      }
      setError('反映に失敗しました: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ハロウィーン怖さ指数</h1>
      <p className={styles.lead}>
        1〜5を選んで「反映する」を押すと保存され、アプリの🎃ハロウィーン攻略に即反映されます
      </p>

      {error && <p className={styles.error}>{error}</p>}

      {isLoading ? (
        <p className={styles.empty}>読み込み中...</p>
      ) : events.length === 0 ? (
        <p className={styles.empty}>対象のイベントがありません</p>
      ) : (
        <div className={styles.list}>
          {events.map(e => {
            const draft = drafts[e.id];
            if (!draft) return null;
            const dirty = isDirty(original[e.id], draft);
            return (
              <div key={e.id} className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardName}>{e.name}</span>
                  {dirty && <span className={styles.dirtyTag}>未反映</span>}
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.badge}>{SUB_CATEGORY_LABEL[e.sub_category] || 'イベント'}</span>
                  <span className={styles.period}>{formatPeriod(e)}</span>
                </div>

                <div className={styles.levelRow}>
                  <button
                    type="button"
                    className={`${styles.levelBtn} ${draft.level === null ? styles.levelBtnNone : ''}`}
                    onClick={() => setLevel(e.id, null)}
                  >
                    なし
                  </button>
                  {LEVELS.map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.levelBtn} ${styles.levelBtnNum} ${
                        draft.level === n ? (n === 5 ? styles.levelBtnMax : styles.levelBtnOn) : ''
                      }`}
                      onClick={() => setLevel(e.id, n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  className={styles.noteInput}
                  value={draft.note}
                  placeholder="ひとことメモ（任意）"
                  onChange={ev => setNote(e.id, ev.target.value)}
                />
              </div>
            );
          })}
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.saveBar}>
        <button
          type="button"
          className={styles.saveBtn}
          disabled={dirtyIds.length === 0 || saving}
          onClick={handleSubmit}
        >
          {saving ? '反映中...' : `反映する（${dirtyIds.length}件）`}
        </button>
      </div>
    </div>
  );
}
