import { useState, useMemo, useEffect } from 'react';
import { getActiveHeightRestrictions } from '../../../data/height-restrictions';
import type { ClosureEntry } from '../../../data/closures';
import { fetchClosures, getClosuresForDate } from '../../../data/closures';
import { fetchAllEvents, getLimitedAttractions, type ParkEvent } from '../../../api/events';
import styles from './components.module.css';

interface Props {
  date: string;
  selected: string[];
  onChange: (names: string[]) => void;
}

export default function StepAttractionSelect({ date, selected, onChange }: Props) {
  const [closures, setClosures] = useState<ClosureEntry[]>([]);
  const [limitedAttractions, setLimitedAttractions] = useState<ParkEvent[]>([]);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    fetchClosures().then((data) => {
      if (!cancelled) setClosures(getClosuresForDate(data, date));
    });
    fetchAllEvents().then((events) => {
      if (!cancelled) setLimitedAttractions(getLimitedAttractions(events, date));
    });
    return () => { cancelled = true; };
  }, [date]);

  const normalize = (s: string) => s.replace(/[™®©]/g, '').trim();

  const closedNormalized = useMemo(
    () => new Set(closures.map((c) => normalize(c.name))),
    [closures],
  );

  const grouped = useMemo(() => {
    const active = getActiveHeightRestrictions(date);
    const map = new Map<string, typeof active>();
    for (const a of active) {
      if (!map.has(a.area)) map.set(a.area, []);
      map.get(a.area)!.push(a);
    }
    return map;
  }, [date]);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>アトラクションを選択</h2>
      <p className={styles.stepDescription}>乗りたいアトラクションをチェック（{selected.length}件選択中）</p>

      {Array.from(grouped.entries()).map(([area, attractions]) => {
        const sorted = [...attractions].sort((a, b) => {
          const aClosed = closedNormalized.has(normalize(a.name)) ? 1 : 0;
          const bClosed = closedNormalized.has(normalize(b.name)) ? 1 : 0;
          return aClosed - bClosed;
        });
        return (
        <div key={area} className={styles.areaGroup}>
          <h3 className={styles.areaTitle}>{area}</h3>
          {sorted.map((a) => {
            const isClosed = closedNormalized.has(normalize(a.name));
            return (
              <label
                key={a.name}
                className={`${styles.checkItem} ${isClosed ? styles.checkItemDisabled : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(a.name)}
                  onChange={() => toggle(a.name)}
                  disabled={isClosed}
                />
                <span className={styles.checkItemImage}>
                  {a.image ? (
                    <img src={a.image} alt="" width={40} height={40} />
                  ) : (
                    <span className={styles.checkItemPlaceholder}>🎢</span>
                  )}
                </span>
                <span className={styles.checkItemLabel}>
                  {a.name}
                  {isClosed && <span className={styles.closedBadge}>休止中</span>}
                </span>
              </label>
            );
          })}
        </div>
        );
      })}

      {/* 期間限定アトラクション */}
      {limitedAttractions.length > 0 && (
        <div className={styles.areaGroup}>
          <h3 className={styles.areaTitle}>✨ 期間限定アトラクション</h3>
          {limitedAttractions.map((evt) => (
            <label key={evt.id} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={selected.includes(evt.name)}
                onChange={() => toggle(evt.name)}
              />
              <span className={styles.checkItemImage}>
                <span className={styles.checkItemPlaceholder}>✨</span>
              </span>
              <span className={styles.checkItemLabel}>
                {evt.official_url ? (
                  <a href={evt.official_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{evt.name}</a>
                ) : evt.name}
                <span className={styles.limitedBadge}>期間限定</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
