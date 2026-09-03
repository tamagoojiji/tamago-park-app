import { useMemo } from 'react';
import type { MyPlanAttraction, MyPlanShow } from '../../../types/myplan';
import styles from './components.module.css';

interface TimeSlot {
  time: string;
  label: string;
  type: 'attraction' | 'show' | 'hold';
  name: string;
  durationMinutes?: number;
}

interface Props {
  openTime: string;
  closeTime: string;
  attractions: MyPlanAttraction[];
  shows: MyPlanShow[];
  onRemoveAttraction?: (name: string) => void;
  onRemoveShow?: (name: string, time: string) => void;
  editable?: boolean;
  id?: string;
  halloween?: boolean;
}

export default function TimelineView({
  openTime, closeTime, attractions, shows,
  onRemoveAttraction, onRemoveShow, editable = false, id, halloween = false,
}: Props) {
  const timeSlots = useMemo(() => generateTimeSlots(openTime, closeTime), [openTime, closeTime]);

  const items = useMemo(() => {
    const all: TimeSlot[] = [];

    for (const show of shows) {
      if (show.holdTime && show.holdMinutes > 0) {
        all.push({ time: show.holdTime, label: `(場所取り) ${show.name}`, type: 'hold', name: show.name });
      }
      all.push({ time: show.time, label: show.name, type: 'show', name: show.name, durationMinutes: 30 });
    }

    for (const attr of attractions) {
      all.push({
        time: attr.startTime,
        label: attr.name,
        type: 'attraction',
        name: attr.name,
        durationMinutes: attr.durationMinutes,
      });
    }

    all.sort((a, b) => a.time.localeCompare(b.time));
    return all;
  }, [attractions, shows]);

  const itemsBySlot = useMemo(() => {
    const map = new Map<string, TimeSlot[]>();
    for (const item of items) {
      const [h, m] = item.time.split(':').map(Number);
      const roundedM = m < 30 ? '00' : '30';
      const slotKey = `${String(h).padStart(2, '0')}:${roundedM}`;
      if (!map.has(slotKey)) map.set(slotKey, []);
      map.get(slotKey)!.push(item);
    }
    return map;
  }, [items]);

  // 場所取り範囲（場所取り開始〜ショー直前のスロット）をオレンジにする
  const holdRangeSlots = useMemo(() => {
    const rangeSet = new Set<string>();
    for (const show of shows) {
      if (!show.holdTime || show.holdMinutes <= 0) continue;
      const holdStart = timeToMinutes(show.holdTime);
      const showStart = timeToMinutes(show.time);
      for (const slot of timeSlots) {
        const slotMin = timeToMinutes(slot);
        // 場所取り開始スロット〜ショー直前スロットまでオレンジ
        if (slotMin >= holdStart && slotMin < showStart) {
          rangeSet.add(slot);
        }
      }
    }
    return rangeSet;
  }, [shows, timeSlots]);

  return (
    <div className={`${styles.timeline} ${halloween ? styles.timelineHalloween : ''}`} id={id}>
      {halloween && <div className={styles.hwFrameHead}>🎃 ハロウィーン・プラン</div>}
      {timeSlots.map((slot) => {
        const slotItems = itemsBySlot.get(slot) || [];
        const hasItems = slotItems.length > 0;
        const isHoldRange = holdRangeSlots.has(slot);

        return (
          <div key={slot} className={styles.timelineRow}>
            <div className={styles.timelineTimeCol}>
              <span className={styles.timelineTime}>{slot}</span>
              <div className={`${styles.timelineLine} ${isHoldRange ? styles.timelineLineHold : ''}`} />
            </div>
            <div className={`${styles.timelineContent} ${isHoldRange && !hasItems ? styles.timelineContentHold : ''}`}>
              {hasItems ? (
                slotItems.map((item, i) => (
                  <div
                    key={`${item.name}-${item.time}-${i}`}
                    className={`${styles.timelineCard} ${
                      item.type === 'hold' ? styles.timelineCardHold :
                      item.type === 'show' ? styles.timelineCardShow :
                      styles.timelineCardAttraction
                    }`}
                  >
                    <div className={styles.timelineCardTime}>{item.time}</div>
                    <div className={styles.timelineCardName}>{item.label}</div>
                    {item.durationMinutes && item.type !== 'hold' && (
                      <div className={styles.timelineCardDuration}>{item.durationMinutes}分</div>
                    )}
                    {editable && item.type !== 'hold' && (
                      <button
                        className={styles.timelineRemoveBtn}
                        onClick={() => {
                          if (item.type === 'attraction') onRemoveAttraction?.(item.name);
                          if (item.type === 'show') onRemoveShow?.(item.name, item.time);
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className={isHoldRange ? styles.timelineHoldFiller : styles.timelineEmpty} />
              )}
            </div>
          </div>
        );
      })}
      {halloween && (
        <div className={styles.hwFrameFoot}>たまごのパーク攻略 ・ park.tamago-ai-world.com 🦇</div>
      )}
    </div>
  );
}

function generateTimeSlots(open: string, close: string): string[] {
  const [oh, om] = open.split(':').map(Number);
  const [ch, cm] = close.split(':').map(Number);
  const start = oh * 60 + (om < 30 ? 0 : 30);
  const end = ch * 60 + cm;
  const slots: string[] = [];
  for (let t = start; t <= end; t += 30) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m === 0 ? '00' : '30')}`);
  }
  return slots;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
