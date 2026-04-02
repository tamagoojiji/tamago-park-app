import { useState, useMemo, useEffect } from 'react';
import type { CalendarTab, PlanItem } from '../types';
import { fetchWeather, weatherCodeToEmoji, type DailyWeather } from '../api/weather';
import { fetchShows, type ShowData, type ShowsResult } from '../api/shows';
import { parkHours } from '../data/hours';
import { annualPassExcluded } from '../data/annual-pass';
import { ticketPrices, getPriceLevel, formatPrice } from '../data/tickets';
import { fetchPrivateEvents } from '../data/private-events';
import type { PrivateEvent } from '../data/private-events';
import { fetchClosures, getClosuresForDate, type ClosuresData } from '../data/closures';
import { getHoldMinutes } from '../data/shows';
import styles from './Calendar.module.css';

const tabs: { id: CalendarTab; label: string; icon: string }[] = [
  { id: 'hours', label: '営業時間', icon: '🕐' },
  { id: 'tickets', label: 'チケット価格', icon: '💰' },
  { id: 'crowd', label: '混雑予想', icon: '👥' },
  { id: 'annual-pass', label: '年パス除外日', icon: '🎫' },
  { id: 'private', label: '貸切', icon: '🔒' },
  { id: 'events', label: 'イベント', icon: '🎉' },
  { id: 'shows', label: 'ショー', icon: '🎭' },
  { id: 'closure', label: 'アトラクション休止情報', icon: '🚧' },
];

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 時刻文字列から分数に変換 "14:00" → 840
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// 分数から時刻文字列に変換 840 → "14:00"
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getTabEmptyMessage(tab: CalendarTab): string {
  switch (tab) {
    case 'hours': return '日付をタップすると営業時間が見れます';
    case 'shows': return 'ショースケジュールを読み込み中...';
    case 'annual-pass': return '○ 利用可 / ✕ 除外日';
    case 'events': return 'イベント情報は準備中です';
    case 'tickets': return '1デイ・スタジオ・パス（大人）の価格';
    case 'crowd': return '混雑予想データは準備中です';
    case 'private': return '貸切マークの日は閉園が早まります';
    case 'closure': return '休止中のアトラクション情報';
  }
}

interface CalendarProps {
  planItems?: PlanItem[];
  onAddPlan?: (item: PlanItem) => void;
}

export default function Calendar({ planItems = [], onAddPlan }: CalendarProps) {
  const [activeTab, setActiveTab] = useState<CalendarTab>('hours');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [weather, setWeather] = useState<DailyWeather[]>([]);
  const [shows, setShows] = useState<ShowData[]>([]);
  const [showsLoading, setShowsLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [privateEvents, setPrivateEvents] = useState<Record<string, PrivateEvent>>({});
  const [closuresData, setClosuresData] = useState<ClosuresData | null>(null);
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

  // 貸切データ取得
  useEffect(() => {
    fetchPrivateEvents().then(setPrivateEvents);
  }, []);

  // 休止情報取得
  useEffect(() => {
    fetchClosures().then(setClosuresData);
  }, []);

  // ショーデータ取得（ショータブ選択時 + 日付変更時）
  useEffect(() => {
    if (activeTab !== 'shows') return;
    const date = selectedDate || today;
    setShowsLoading(true);
    fetchShows(date)
      .then((result: ShowsResult) => {
        setShows(result.shows);
        setScheduleDate(result.scheduleDate);
        setAvailableDates(result.availableDates);
      })
      .catch((e) => console.error('ショー取得エラー:', e))
      .finally(() => setShowsLoading(false));
  }, [activeTab, selectedDate, today]);

  // プランに追加済みか判定
  const isPlanAdded = (showName: string, time: string) => {
    return planItems.some(p => p.showName === showName && p.time === time);
  };

  // ショーの時間をタップしてプランに追加
  const handleAddShowToPlan = (showName: string, time: string) => {
    if (!onAddPlan || isPlanAdded(showName, time)) return;
    const holdMin = getHoldMinutes(showName);
    const holdTime = holdMin > 0
      ? minutesToTime(timeToMinutes(time) - holdMin)
      : undefined;
    onAddPlan({
      id: `${showName}_${time}`,
      showName,
      time,
      holdTime,
      holdMinutes: holdMin,
    });
  };

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
                    {activeTab === 'shows' && availableDates.includes(dateStr) && (
                      <span className={styles.showAvailableLabel}>🎭</span>
                    )}
                    {activeTab === 'closure' && closuresData && (() => {
                      const count = getClosuresForDate(closuresData, dateStr).length;
                      return count > 0 ? (
                        <span className={styles.closureLabel}>{count}件</span>
                      ) : null;
                    })()}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 日付選択時の詳細 */}
      {selectedDate && activeTab !== 'shows' && activeTab !== 'closure' && (
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

          {/* 休止情報 */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>🚧</span>
            <span className={styles.infoLabel}>休止</span>
            {closuresData ? (() => {
              const closures = getClosuresForDate(closuresData, selectedDate);
              return closures.length > 0 ? (
                <span className={`${styles.infoValue} ${styles.textOrange}`}>{closures.length}件休止中</span>
              ) : (
                <span className={styles.infoValue}>なし</span>
              );
            })() : (
              <span className={`${styles.infoValue} ${styles.textGray}`}>読込中</span>
            )}
          </div>
        </div>
      )}
      {/* タブコンテンツ */}
      {activeTab === 'closure' ? (
        <div className={styles.tabContent}>
          {!closuresData ? (
            <p className={styles.tabPlaceholder}>休止情報を読み込み中...</p>
          ) : (() => {
            const dateStr = selectedDate || today;
            const closures = getClosuresForDate(closuresData, dateStr);
            return closures.length === 0 ? (
              <p className={styles.tabPlaceholder}>
                {new Date(dateStr + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}は休止中のアトラクションはありません
              </p>
            ) : (
              <div className={styles.closureList}>
                <p className={styles.closureCount}>
                  🚧 {closures.length}件のアトラクションが休止中
                </p>
                {closures.map((c) => (
                  <div key={c.name} className={styles.closureItem}>
                    <span className={styles.closureName}>{c.name}</span>
                    <span className={styles.closurePeriod}>{c.period}</span>
                  </div>
                ))}
                {closuresData.updated && (
                  <p className={styles.closureUpdated}>
                    最終更新: {closuresData.updated}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      ) : activeTab === 'shows' ? (
        <div className={styles.tabContent}>
          {showsLoading ? (
            <p className={styles.tabPlaceholder}>ショースケジュールを読み込み中...</p>
          ) : shows.length === 0 ? (
            <p className={styles.tabPlaceholder}>
              {scheduleDate
                ? `${new Date(scheduleDate + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}のスケジュールはまだありません`
                : '日付をタップしてショースケジュールを確認'}
            </p>
          ) : (
            <div className={styles.showList}>
              {scheduleDate && (
                <p className={styles.scheduleDateInfo}>
                  {new Date(scheduleDate + 'T00:00:00').toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                  })}分の情報
                </p>
              )}
              {shows.map((show) => (
                <div key={show.name} className={styles.showItem}>
                  <div className={styles.showName}>{show.name}</div>
                  <div className={styles.showTimes}>
                    {show.times.map((time) => {
                      const added = isPlanAdded(show.name, time);
                      return (
                        <button
                          key={time}
                          className={`${styles.showTimeBtn} ${added ? styles.showTimeBtnAdded : ''}`}
                          onClick={() => handleAddShowToPlan(show.name, time)}
                          disabled={!onAddPlan}
                        >
                          {time}
                          {added && <span className={styles.showTimeCheck}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  {getHoldMinutes(show.name) > 0 && (
                    <div className={styles.showHoldInfo}>
                      場所取り: {getHoldMinutes(show.name)}分前
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.tabContent}>
          <p className={styles.tabPlaceholder}>
            {getTabEmptyMessage(activeTab)}
          </p>
        </div>
      )}
    </section>
  );
}
