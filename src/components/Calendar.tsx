import { useState, useMemo, useEffect } from 'react';
import type { CalendarTab } from '../types';
import { fetchWeather, weatherCodeToEmoji, type DailyWeather } from '../api/weather';
import { parkHours } from '../data/hours';
import { annualPassExcluded } from '../data/annual-pass';
import { ticketPrices, getPriceLevel, formatPrice } from '../data/tickets';
import { privateEvents } from '../data/private-events';
import styles from './Calendar.module.css';

const tabs: { id: CalendarTab; label: string; icon: string }[] = [
  { id: 'hours', label: '営業時間', icon: '🕐' },
  { id: 'annual-pass', label: '年パス除外日', icon: '🎫' },
  { id: 'events', label: 'イベント', icon: '🎉' },
  { id: 'tickets', label: 'チケット価格', icon: '💰' },
  { id: 'crowd', label: '混雑予想', icon: '👥' },
  { id: 'private', label: '貸切', icon: '🔒' },
];

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

function getTabEmptyMessage(tab: CalendarTab): string {
  switch (tab) {
    case 'hours': return '日付をタップすると営業時間が見れます';
    case 'annual-pass': return '○ 利用可 / ✕ 除外日';
    case 'events': return 'イベント情報は準備中です';
    case 'tickets': return '1デイ・スタジオ・パス（大人）の価格';
    case 'crowd': return '混雑予想データは準備中です';
    case 'private': return '貸切マークの日は閉園が早まります';
  }
}

export default function Calendar() {
  const [activeTab, setActiveTab] = useState<CalendarTab>('hours');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weather, setWeather] = useState<DailyWeather[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // 天気データ取得
  useEffect(() => {
    fetchWeather()
      .then(setWeather)
      .catch((e) => console.error('天気取得エラー:', e));
  }, []);

  const weatherMap = useMemo(() => {
    const map = new Map<string, DailyWeather>();
    weather.forEach((w) => map.set(w.date, w));
    return map;
  }, [weather]);

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
    setSelectedDate(null);
  };

  const getDateStr = (day: number) => {
    const { year, month } = currentMonth;
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayClass = (day: number | null) => {
    if (!day) return styles.emptyDay;
    const dateStr = getDateStr(day);
    const dayOfWeek = new Date(currentMonth.year, currentMonth.month, day).getDay();
    const classes = [styles.day];
    if (dateStr === today) classes.push(styles.today);
    if (dateStr === selectedDate) classes.push(styles.selected);
    if (dayOfWeek === 0) classes.push(styles.sunday);
    if (dayOfWeek === 6) classes.push(styles.saturday);
    return classes.join(' ');
  };

  const handleDayClick = (day: number) => {
    const dateStr = getDateStr(day);
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
  };

  // 営業時間の短縮表示（カレンダーセル用）2行分
  const getShortHours = (dateStr: string): { open: string; close: string } | null => {
    const hours = parkHours[dateStr];
    if (!hours) return null;
    const match = hours.match(/(\d{2}):(\d{2})~(\d{2}):(\d{2})/);
    if (!match) return null;
    const openH = parseInt(match[1]);
    const openM = match[2];
    const closeH = parseInt(match[3]);
    const closeM = match[4];
    return {
      open: `${openH}:${openM}`,
      close: `~${closeH}:${closeM}`,
    };
  };

  // 選択中の日付の詳細情報
  const selectedWeather = selectedDate ? weatherMap.get(selectedDate) : null;

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
      <div className={styles.calendarCard}>
        <div className={styles.weekdays}>
          {WEEKDAYS.map((w, i) => (
            <span key={w} className={`${styles.weekday} ${i === 0 ? styles.sunday : ''} ${i === 6 ? styles.saturday : ''}`}>
              {w}
            </span>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {calendarDays.map((day, i) => {
            const dateStr = day ? getDateStr(day) : '';
            const w = day ? weatherMap.get(dateStr) : null;
            const shortHours = day ? getShortHours(dateStr) : null;

            return (
              <div
                key={i}
                className={getDayClass(day)}
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <>
                    <span className={styles.dayNumber}>{day}</span>
                    {w && (
                      <span className={styles.weatherIcon}>
                        {weatherCodeToEmoji(w.weatherCode)}
                      </span>
                    )}
                    {activeTab === 'hours' && shortHours && (
                      <span className={styles.hoursLabel}>
                        <span>{shortHours.open}</span>
                        <span>{shortHours.close}</span>
                      </span>
                    )}
                    {activeTab === 'annual-pass' && (
                      <span className={annualPassExcluded.has(dateStr) ? styles.excludedLabel : styles.availableLabel}>
                        {annualPassExcluded.has(dateStr) ? '✕' : '○'}
                      </span>
                    )}
                    {activeTab === 'tickets' && ticketPrices[dateStr] && (
                      <span className={`${styles.priceLabel} ${styles[`price_${getPriceLevel(ticketPrices[dateStr])}`]}`}>
                        {ticketPrices[dateStr].toLocaleString()}
                      </span>
                    )}
                    {activeTab === 'private' && privateEvents[dateStr] && (
                      <span className={styles.privateLabel}>貸切</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 日付選択時の詳細（全情報をまとめて表示） */}
      {selectedDate && (
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span className={styles.detailDate}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('ja-JP', {
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </span>
          </div>

          {/* 天気予報 */}
          {selectedWeather && (
            <div className={styles.infoRow}>
              <span className={styles.infoIcon}>
                {weatherCodeToEmoji(selectedWeather.weatherCode)}
              </span>
              <span className={styles.infoLabel}>天気</span>
              <div className={styles.infoValue}>
                <span className={styles.tempMax}>{selectedWeather.tempMax}°</span>
                <span className={styles.tempSep}>/</span>
                <span className={styles.tempMin}>{selectedWeather.tempMin}°</span>
                <span className={styles.precipitation}>☔{selectedWeather.precipitationProb}%</span>
              </div>
            </div>
          )}

          {/* 営業時間 */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>🕐</span>
            <span className={styles.infoLabel}>営業時間</span>
            <span className={styles.infoValue}>
              {parkHours[selectedDate] || '未定'}
            </span>
          </div>

          {/* チケット価格 */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>💰</span>
            <span className={styles.infoLabel}>チケット価格</span>
            <span className={`${styles.infoValue} ${ticketPrices[selectedDate] ? styles[`priceText_${getPriceLevel(ticketPrices[selectedDate])}`] : ''}`}>
              {ticketPrices[selectedDate] ? formatPrice(ticketPrices[selectedDate]) : '未定'}
            </span>
          </div>

          {/* 年パス除外日 */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>🎫</span>
            <span className={styles.infoLabel}>年パス</span>
            <span className={`${styles.infoValue} ${annualPassExcluded.has(selectedDate) ? styles.textRed : styles.textGreen}`}>
              {annualPassExcluded.has(selectedDate) ? '除外日' : '利用可'}
            </span>
          </div>

          {/* イベント */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>🎉</span>
            <span className={styles.infoLabel}>イベント</span>
            <span className={`${styles.infoValue} ${styles.textGray}`}>準備中</span>
          </div>

          {/* 混雑予想 */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>👥</span>
            <span className={styles.infoLabel}>混雑予想</span>
            <span className={`${styles.infoValue} ${styles.textGray}`}>準備中</span>
          </div>

          {/* 貸切 */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>🔒</span>
            <span className={styles.infoLabel}>貸切</span>
            {privateEvents[selectedDate] ? (
              <div className={styles.infoValueCol}>
                <span className={styles.textRed}>{privateEvents[selectedDate].name}</span>
                <span className={styles.infoSubText}>{privateEvents[selectedDate].time}</span>
              </div>
            ) : (
              <span className={styles.infoValue}>なし</span>
            )}
          </div>
        </div>
      )}

      {/* タブ */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* タブ全体の説明 */}
      <div className={styles.tabContent}>
        <p className={styles.tabPlaceholder}>
          {getTabEmptyMessage(activeTab)}
        </p>
      </div>
    </section>
  );
}
