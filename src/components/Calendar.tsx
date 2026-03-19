import { useState, useMemo } from 'react';
import type { CalendarTab } from '../types';
import styles from './Calendar.module.css';

const tabs: { id: CalendarTab; label: string }[] = [
  { id: 'hours', label: '営業時間' },
  { id: 'annual-pass', label: '年パス' },
  { id: 'events', label: 'イベント' },
  { id: 'tickets', label: 'チケット' },
  { id: 'crowd', label: '混雑予想' },
  { id: 'private', label: '貸切' },
];

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function Calendar() {
  const [activeTab, setActiveTab] = useState<CalendarTab>('hours');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [currentMonth]);

  const formatMonth = () => {
    const { year, month } = currentMonth;
    return `${year}年${month + 1}月`;
  };

  const changeMonth = (diff: number) => {
    setCurrentMonth((prev) => {
      const d = new Date(prev.year, prev.month + diff, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const getDayClass = (day: number | null) => {
    if (!day) return styles.emptyDay;
    const { year, month } = currentMonth;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, day).getDay();
    const classes = [styles.day];
    if (dateStr === today) classes.push(styles.today);
    if (dayOfWeek === 0) classes.push(styles.sunday);
    if (dayOfWeek === 6) classes.push(styles.saturday);
    return classes.join(' ');
  };

  return (
    <section className={styles.calendarSection}>
      {/* 月ナビゲーション */}
      <div className={styles.monthNav}>
        <button className={styles.navButton} onClick={() => changeMonth(-1)}>
          ‹
        </button>
        <span className={styles.monthLabel}>{formatMonth()}</span>
        <button className={styles.navButton} onClick={() => changeMonth(1)}>
          ›
        </button>
      </div>

      {/* カレンダーグリッド */}
      <div className={styles.weekdays}>
        {WEEKDAYS.map((w, i) => (
          <span key={w} className={`${styles.weekday} ${i === 0 ? styles.sunday : ''} ${i === 6 ? styles.saturday : ''}`}>
            {w}
          </span>
        ))}
      </div>
      <div className={styles.daysGrid}>
        {calendarDays.map((day, i) => (
          <div key={i} className={getDayClass(day)}>
            {day && (
              <>
                <span className={styles.dayNumber}>{day}</span>
                {/* 天気アイコン・営業時間はAPI連携後に表示 */}
              </>
            )}
          </div>
        ))}
      </div>

      {/* タブ */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className={styles.tabContent}>
        <p className={styles.tabPlaceholder}>
          {activeTab === 'hours' && '営業時間データは準備中です'}
          {activeTab === 'annual-pass' && '年パス除外日データは準備中です'}
          {activeTab === 'events' && 'イベント情報は準備中です'}
          {activeTab === 'tickets' && 'チケット値段情報は準備中です'}
          {activeTab === 'crowd' && '混雑予想データは準備中です'}
          {activeTab === 'private' && '貸切情報は準備中です'}
        </p>
      </div>
    </section>
  );
}
