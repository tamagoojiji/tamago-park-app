import { useState, useEffect, useRef } from 'react';
import type { ShowData } from '../../../api/shows';
import { fetchShows } from '../../../api/shows';
import styles from './components.module.css';

interface Props {
  date: string;
  selected: string[];
  onChange: (names: string[]) => void;
}

export default function StepShowSelect({ date, selected, onChange }: Props) {
  const [shows, setShows] = useState<ShowData[] | null>(null);
  const fetchedRef = useRef('');

  useEffect(() => {
    if (!date || date === fetchedRef.current) return;
    fetchedRef.current = date;
    let cancelled = false;
    fetchShows(date)
      .then((result) => { if (!cancelled) setShows(result.shows); })
      .catch(() => { if (!cancelled) setShows([]); });
    return () => { cancelled = true; };
  }, [date]);

  const loading = shows === null;

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  if (loading) {
    return (
      <div className={styles.stepSection}>
        <h2 className={styles.stepTitle}>ショーを選択</h2>
        <p className={styles.loadingText}>ショー情報を取得中...</p>
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <div className={styles.stepSection}>
        <h2 className={styles.stepTitle}>ショーを選択</h2>
        <p className={styles.stepDescription}>この日のショー情報がまだありません。スキップして次へ進めます。</p>
      </div>
    );
  }

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>ショーを選択</h2>
      <p className={styles.stepDescription}>見たいショーをチェック（{selected.length}件選択中）</p>

      {shows!.map((show) => (
        <label key={show.name} className={styles.checkItem}>
          <input
            type="checkbox"
            checked={selected.includes(show.name)}
            onChange={() => toggle(show.name)}
          />
          <span className={styles.checkItemImage}>
            <span className={styles.checkItemPlaceholder}>🎭</span>
          </span>
          <span className={styles.checkItemLabel}>
            {show.name}
            <span className={styles.showTimesHint}>{show.times.length}回公演</span>
          </span>
        </label>
      ))}
    </div>
  );
}
