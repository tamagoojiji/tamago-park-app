import { useState } from 'react';
import type { MyPlanAttraction, MyPlanShow } from '../../../types/myplan';
import TimelineView from './TimelineView';
import styles from './components.module.css';

interface Props {
  openTime: string;
  closeTime: string;
  attractions: MyPlanAttraction[];
  shows: MyPlanShow[];
  onChangeAttractions: (attractions: MyPlanAttraction[]) => void;
  onChangeShows: (shows: MyPlanShow[]) => void;
}

// 配置先選択用モーダル
interface TimePickerState {
  attractionName: string;
  area: string;
  image: string;
}

export default function StepScheduleEditor({
  openTime, closeTime, attractions, shows,
  onChangeAttractions, onChangeShows,
}: Props) {
  const [picker, setPicker] = useState<TimePickerState | null>(null);
  const [pickerTime, setPickerTime] = useState('');
  const [pickerDuration, setPickerDuration] = useState(60);

  const unplacedAttractions = attractions.filter((a) => !a.startTime);
  const placedAttractions = attractions.filter((a) => a.startTime);

  const handleOpenPicker = (attr: MyPlanAttraction) => {
    setPicker({ attractionName: attr.name, area: attr.area, image: attr.image });
    setPickerTime(openTime);
    setPickerDuration(attr.durationMinutes || 60);
  };

  const handleConfirmPicker = () => {
    if (!picker || !pickerTime) return;
    const updated = attractions.map((a) =>
      a.name === picker.attractionName
        ? { ...a, startTime: pickerTime, durationMinutes: pickerDuration }
        : a,
    );
    onChangeAttractions(updated);
    setPicker(null);
  };

  const handleRemoveAttraction = (name: string) => {
    const updated = attractions.map((a) =>
      a.name === name ? { ...a, startTime: '' } : a,
    );
    onChangeAttractions(updated);
  };

  const handleRemoveShow = (name: string, time: string) => {
    onChangeShows(shows.filter((s) => !(s.name === name && s.time === time)));
  };

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>タイムスケジュール編集</h2>

      <div className={styles.warningBanner}>
        待ち時間は日によって大きく異なります。<br />
        余裕を持ったスケジュールをおすすめします。
      </div>

      {/* 未配置アトラクション */}
      {unplacedAttractions.length > 0 && (
        <div className={styles.unplacedSection}>
          <h3 className={styles.unplacedTitle}>未配置のアトラクション</h3>
          <div className={styles.unplacedList}>
            {unplacedAttractions.map((attr) => (
              <button
                key={attr.name}
                className={styles.unplacedItem}
                onClick={() => handleOpenPicker(attr)}
              >
                <span className={styles.unplacedIcon}>🎢</span>
                <span className={styles.unplacedName}>{attr.name}</span>
                <span className={styles.unplacedAction}>時間を設定 →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* タイムライン */}
      <TimelineView
        openTime={openTime}
        closeTime={closeTime}
        attractions={placedAttractions}
        shows={shows}
        onRemoveAttraction={handleRemoveAttraction}
        onRemoveShow={handleRemoveShow}
        editable
      />

      {/* 時間ピッカーモーダル */}
      {picker && (
        <>
          <div className={styles.modalOverlay} onClick={() => setPicker(null)} />
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>{picker.attractionName}</h3>
            <label className={styles.modalLabel}>
              開始時間
              <input
                type="time"
                className={styles.modalInput}
                value={pickerTime}
                onChange={(e) => setPickerTime(e.target.value)}
              />
            </label>
            <label className={styles.modalLabel}>
              所要時間（分）
              <select
                className={styles.modalInput}
                value={pickerDuration}
                onChange={(e) => setPickerDuration(Number(e.target.value))}
              >
                {[30, 45, 60, 90, 120].map((m) => (
                  <option key={m} value={m}>{m}分</option>
                ))}
              </select>
            </label>
            <div className={styles.modalButtons}>
              <button className={styles.modalCancel} onClick={() => setPicker(null)}>キャンセル</button>
              <button className={styles.modalConfirm} onClick={handleConfirmPicker}>配置する</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
