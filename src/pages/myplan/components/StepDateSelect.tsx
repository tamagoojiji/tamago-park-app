import { useMemo, useState, useEffect } from 'react';
import { fetchParkHours } from '../../../data/hours';
import styles from './components.module.css';

interface Props {
  date: string;
  onChange: (date: string, openTime: string, closeTime: string) => void;
}

export default function StepDateSelect({ date, onChange }: Props) {
  const [parkHours, setParkHours] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchParkHours().then(setParkHours);
  }, []);

  const availableDates = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return Object.keys(parkHours)
      .filter((d) => d >= today)
      .sort();
  }, [parkHours]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    const hours = parkHours[selected];
    if (hours) {
      const [open, close] = hours.split('~');
      onChange(selected, open, close);
    } else {
      onChange(selected, '09:00', '21:00');
    }
  };

  const selectedHours = date ? parkHours[date] : null;

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>来園日を選択</h2>
      <p className={styles.stepDescription}>プランを作りたい日を選んでください</p>

      <input
        type="date"
        className={styles.dateInput}
        value={date}
        min={availableDates[0] || ''}
        max={availableDates[availableDates.length - 1] || ''}
        onChange={handleDateChange}
      />

      {selectedHours && (
        <div className={styles.hoursInfo}>
          <span className={styles.hoursIcon}>🕐</span>
          <span>営業時間: {selectedHours}</span>
        </div>
      )}

      {date && !selectedHours && (
        <div className={styles.warningBanner}>
          この日の営業時間データがありません。デフォルト（9:00〜21:00）で作成します。
        </div>
      )}
    </div>
  );
}
