import { useState, useEffect, useRef } from 'react';
import type { ShowData } from '../../../api/shows';
import { fetchShows } from '../../../api/shows';
import { getHoldMinutes } from '../../../data/shows';
import type { MyPlanShow } from '../../../types/myplan';
import styles from './components.module.css';

interface Props {
  date: string;
  selectedShowNames: string[];
  showSchedule: MyPlanShow[];
  onChange: (shows: MyPlanShow[]) => void;
}

export default function StepShowTimeSelect({ date, selectedShowNames, showSchedule, onChange }: Props) {
  const [allShows, setAllShows] = useState<ShowData[]>([]);
  const autoPlacedRef = useRef(false);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    fetchShows(date)
      .then((result) => { if (!cancelled) setAllShows(result.shows); })
      .catch(() => { if (!cancelled) setAllShows([]); });
    return () => { cancelled = true; };
  }, [date]);

  const selectedShows = allShows.filter((s) => selectedShowNames.includes(s.name));

  // 1回公演のショーを自動配置（初回のみ）
  useEffect(() => {
    if (autoPlacedRef.current || selectedShows.length === 0) return;
    autoPlacedRef.current = true;

    const autoPlaced: MyPlanShow[] = [];
    for (const show of selectedShows) {
      if (show.times.length === 1) {
        const holdMinutes = getHoldMinutes(show.name);
        const holdTime = holdMinutes > 0 ? subtractMinutes(show.times[0], holdMinutes) : undefined;
        autoPlaced.push({
          name: show.name,
          time: show.times[0],
          holdTime,
          holdMinutes,
        });
      }
    }

    const existingNames = new Set(showSchedule.map((s) => s.name));
    const newOnes = autoPlaced.filter((s) => !existingNames.has(s.name));
    if (newOnes.length > 0) {
      onChange([...showSchedule, ...newOnes]);
    }
  }, [selectedShows.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTime = (showName: string, time: string) => {
    const holdMinutes = getHoldMinutes(showName);
    const holdTime = holdMinutes > 0 ? subtractMinutes(time, holdMinutes) : undefined;

    const existing = showSchedule.find((s) => s.name === showName && s.time === time);
    if (existing) {
      onChange(showSchedule.filter((s) => !(s.name === showName && s.time === time)));
    } else {
      onChange([...showSchedule, { name: showName, time, holdTime, holdMinutes }]);
    }
  };

  const multiTimeShows = selectedShows.filter((s) => s.times.length > 1);

  if (multiTimeShows.length === 0) {
    const autoPlacedCount = selectedShows.filter((s) => s.times.length === 1).length;
    return (
      <div className={styles.stepSection}>
        <h2 className={styles.stepTitle}>ショー時間選択</h2>
        {autoPlacedCount > 0 ? (
          <p className={styles.stepDescription}>{autoPlacedCount}件のショーを自動で配置しました。次へ進んでください。</p>
        ) : (
          <p className={styles.stepDescription}>時間選択が必要なショーはありません。次へ進んでください。</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>ショー時間選択</h2>
      <p className={styles.stepDescription}>複数回公演のショーは見たい回を選んでください（複数選択OK）</p>

      {multiTimeShows.map((show) => (
        <div key={show.name} className={styles.showTimeGroup}>
          <h3 className={styles.showTimeName}>{show.name}</h3>
          <div className={styles.timeChips}>
            {show.times.map((time) => {
              const isSelected = showSchedule.some((s) => s.name === show.name && s.time === time);
              return (
                <button
                  key={time}
                  type="button"
                  className={`${styles.timeChip} ${isSelected ? styles.timeChipActive : ''}`}
                  onClick={() => toggleTime(show.name, time)}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function subtractMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m - minutes;
  const rh = Math.floor(total / 60);
  const rm = total % 60;
  return `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}`;
}
