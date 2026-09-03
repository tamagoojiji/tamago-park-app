import { useState, useEffect } from 'react';
import { fetchAllEvents, getHalloween2026Events, type ParkEvent } from '../api/events';
import { SCARE_LEVELS, ZOMBIE_INFO, KIDS_NOTE } from '../data/halloween';
import styles from './HalloweenPage.module.css';

type Filter = 'all' | 'show' | 'attraction' | 'event';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'show', label: 'ショー' },
  { id: 'attraction', label: 'アトラクション' },
  { id: 'event', label: 'イベント' },
];

function formatPeriod(e: ParkEvent): string {
  const fmt = (d: string) => {
    const dt = new Date(d + 'T00:00:00');
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  };
  return e.end_date ? `${fmt(e.date)} 〜 ${fmt(e.end_date)}` : fmt(e.date);
}

export default function HalloweenPage() {
  const [events, setEvents] = useState<ParkEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    let cancelled = false;
    fetchAllEvents().then((all) => {
      if (cancelled) return;
      setEvents(getHalloween2026Events(all));
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = events.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'show') return e.sub_category === 'show';
    if (filter === 'attraction') return e.sub_category === 'attraction';
    return e.sub_category !== 'show' && e.sub_category !== 'attraction';
  });

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>🎃 ハロウィーン攻略</h1>

      <div className={styles.zombieCard}>
        <div className={styles.zombieTitle}>🧟 ストリート・ゾンビ</div>
        <p className={styles.zombieText}>{ZOMBIE_INFO}</p>
      </div>

      <div className={styles.chips}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`${styles.chip} ${filter === f.id ? styles.chipActive : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className={styles.placeholder}>読み込み中...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.placeholder}>該当するイベントはありません</p>
      ) : (
        <div className={styles.list}>
          {filtered.map((e) => {
            const scare = SCARE_LEVELS[e.name];
            return (
              <div key={e.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{e.name}</span>
                  {e.official_url && (
                    <a
                      href={e.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.officialLink}
                    >
                      (公式)
                    </a>
                  )}
                </div>
                <div className={styles.cardPeriod}>{formatPeriod(e)}</div>
                {scare && (
                  <div className={styles.scare}>
                    <span className={styles.scareLabel}>怖さ</span>
                    <span className={styles.scareBars}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`${styles.scareBar} ${
                            n <= scare.level
                              ? n === 5
                                ? styles.scareBarMax
                                : styles.scareBarOn
                              : ''
                          }`}
                        />
                      ))}
                    </span>
                    {scare.note && <span className={styles.scareNote}>{scare.note}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.kidsCard}>
        <div className={styles.kidsTitle}>👶 小さい子と一緒なら</div>
        <p className={styles.kidsText}>{KIDS_NOTE}</p>
      </div>
    </main>
  );
}
