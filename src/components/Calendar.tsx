import { useState, useMemo, useEffect, useRef } from 'react';
import type { CalendarTab, PlanItem } from '../types';
import { fetchWeather, weatherCodeToEmoji, type DailyWeather } from '../api/weather';
import { fetchShows, type ShowData, type ShowsResult } from '../api/shows';
import { parkHours } from '../data/hours';
import { annualPassExcluded } from '../data/annual-pass';
import { ticketPrices, getPriceLevel, formatPrice } from '../data/tickets';
import { AUTH_BASE, fetchAllEvents, getEventsForDate, getEventStartEndForDate, getOngoingLimitedEvents, getSingleDayEvents, hasPrivateEventOnDate, hasEventStartOrEndOnDate, hasEventOnDate, type ParkEvent } from '../api/events';
import { fetchClosures, getClosuresForDate, type ClosuresData } from '../data/closures';
import { fetchRestaurants, type RestaurantInfo } from '../api/restaurants';
import ShowSchedule from './ShowSchedule';
import RestaurantList from './RestaurantList';
import styles from './Calendar.module.css';

const tabs: { id: CalendarTab; label: string; icon: string; disabled?: boolean }[] = [
  { id: 'hours', label: '営業時間', icon: '🕐' },
  { id: 'tickets', label: 'チケット価格', icon: '💰' },
  { id: 'crowd', label: '混雑予想(準備中)', icon: '👥', disabled: true },
  { id: 'annual-pass', label: '年パス除外日\n貸切ナイト日', icon: '🎫' },
  { id: 'restaurant', label: 'レストラン\n一覧', icon: '🍽️' },
  { id: 'events', label: 'イベント', icon: '🎉' },
  { id: 'shows', label: 'ショー', icon: '🎭' },
  { id: 'closure', label: 'アトラクション\n休止情報', icon: '🚧' },
];

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 日本の祝日（2026年）
const HOLIDAYS: Record<string, string> = {
  '2026-01-01': '元日',
  '2026-01-12': '成人の日',
  '2026-02-11': '建国記念の日',
  '2026-02-23': '天皇誕生日',
  '2026-03-20': '春分の日',
  '2026-04-29': '昭和の日',
  '2026-05-03': '憲法記念日',
  '2026-05-04': 'みどりの日',
  '2026-05-05': 'こどもの日',
  '2026-05-06': '振替休日',
  '2026-07-20': '海の日',
  '2026-08-11': '山の日',
  '2026-09-21': '敬老の日',
  '2026-09-22': '秋分の日',
  '2026-09-23': '国民の休日',
  '2026-10-12': 'スポーツの日',
  '2026-11-03': '文化の日',
  '2026-11-23': '勤労感謝の日',
  '2027-01-01': '元日',
  '2027-01-11': '成人の日',
  '2027-02-11': '建国記念の日',
  '2027-02-23': '天皇誕生日',
  '2027-03-21': '春分の日',
  '2027-04-29': '昭和の日',
  '2027-05-03': '憲法記念日',
  '2027-05-04': 'みどりの日',
  '2027-05-05': 'こどもの日',
};


function getTabEmptyMessage(tab: CalendarTab): string {
  switch (tab) {
    case 'hours': return '日付をタップすると営業時間が見れます';
    case 'shows': return 'ショースケジュールを読み込み中...';
    case 'annual-pass': return '貸切の日は、営業時間が短いです';
    case 'events': return 'イベント情報は準備中です';
    case 'tickets': return '1デイ・スタジオ・パス（大人）の価格';
    case 'crowd': return '混雑予想データは準備中です';
    case 'restaurant': return 'レストラン一覧は準備中です';
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
  const [parkEvents, setParkEvents] = useState<ParkEvent[]>([]);
  const [closuresData, setClosuresData] = useState<ClosuresData | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(false);
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

  // イベント・貸切データ取得
  useEffect(() => {
    fetchAllEvents().then(setParkEvents);
  }, []);

  // 休止情報取得
  useEffect(() => {
    fetchClosures().then(setClosuresData);
  }, []);

  // レストランデータ取得
  useEffect(() => {
    if (activeTab !== 'restaurant') return;
    const date = selectedDate || today;
    setRestaurantsLoading(true);
    fetchRestaurants(date)
      .then((res) => setRestaurants(res.restaurants))
      .catch((e) => console.error('レストラン取得エラー:', e))
      .finally(() => setRestaurantsLoading(false));
  }, [activeTab, selectedDate, today]);

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
    if (dayOfWeek === 0 || HOLIDAYS[dateStr]) classes.push(styles.sunday);
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

  // スワイプで月切り替え
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      changeMonth(diff > 0 ? 1 : -1);
    }
    touchStart.current = null;
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
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''} ${tab.disabled ? styles.tabDisabled : ''}`}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
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
      <div className={styles.calendarCard} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
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
                      <>
                        {annualPassExcluded.has(dateStr) && (
                          <span className={styles.excludedLabel}>除外日</span>
                        )}
                        {hasPrivateEventOnDate(parkEvents, dateStr) && (
                          <span className={styles.privateLabel}>貸切</span>
                        )}
                      </>
                    )}
                    {activeTab === 'tickets' && ticketPrices[dateStr] && (
                      <span className={`${styles.priceLabel} ${styles[`price_${getPriceLevel(ticketPrices[dateStr])}`]}`}>
                        {ticketPrices[dateStr].toLocaleString()}
                      </span>
                    )}
                    {activeTab === 'events' && hasEventStartOrEndOnDate(parkEvents, dateStr) && (
                      <span className={styles.showAvailableLabel}>🆕</span>
                    )}
                    {activeTab === 'events' && !hasEventStartOrEndOnDate(parkEvents, dateStr) && hasEventOnDate(parkEvents, dateStr) && (
                      <span className={styles.eventDotLabel}>•</span>
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
      {selectedDate && activeTab !== 'shows' && activeTab !== 'closure' && activeTab !== 'restaurant' && (
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

          {/* イベント（開始・終了日のみ） */}
          <div className={styles.infoRow}>
            <span className={styles.infoIcon}>🎉</span>
            <span className={styles.infoLabel}>イベント</span>
            {(() => {
              const dayEvents = getEventStartEndForDate(parkEvents, selectedDate);
              return dayEvents.length > 0 ? (
                <div className={styles.infoValueCol}>
                  {dayEvents.map(e => (
                    <span key={e.id}>{e.date === selectedDate ? '🆕' : '🔚'} {e.name}</span>
                  ))}
                </div>
              ) : (
                <span className={styles.infoValue}>なし</span>
              );
            })()}
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
            {(() => {
              const privateEvts = getEventsForDate(parkEvents, selectedDate).filter(e => e.category === 'private');
              return privateEvts.length > 0 ? (
                <div className={styles.infoValueCol}>
                  {privateEvts.map(e => (
                    <div key={e.id}>
                      <span className={styles.textRed}>{e.name}</span>
                      {e.summary && <span className={styles.infoSubText}>{e.summary}</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <span className={styles.infoValue}>なし</span>
              );
            })()}
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
      ) : activeTab === 'events' ? (
        <div className={styles.tabContent}>
          {parkEvents.length === 0 ? (
            <p className={styles.tabPlaceholder}>イベント情報はまだありません</p>
          ) : (() => {
            const dateStr = selectedDate || today;
            const startEndEvents = getEventStartEndForDate(parkEvents, dateStr);
            const ongoingEvents = getOngoingLimitedEvents(parkEvents, dateStr);
            const singleEvents = getSingleDayEvents(parkEvents, dateStr);

            const formatPeriod = (e: ParkEvent) => {
              const fmt = (d: string) => {
                const dt = new Date(d + 'T00:00:00');
                return `${dt.getMonth() + 1}/${dt.getDate()}`;
              };
              if (e.end_date) return `${fmt(e.date)} 〜 ${fmt(e.end_date)}`;
              return fmt(e.date);
            };

            const formatEndDate = (e: ParkEvent) => {
              if (!e.end_date) return '';
              const dt = new Date(e.end_date + 'T00:00:00');
              return `〜${dt.getMonth() + 1}/${dt.getDate()}`;
            };

            const subCatLabel = (sc: string) => sc === 'attraction' ? '🎢 アトラクション' : sc === 'show' ? '🎭 ショー' : '🎪 イベント';
            const subCatEmoji = (sc: string) => sc === 'attraction' ? '🎢' : sc === 'show' ? '🎭' : '🎪';
            const isStart = (e: ParkEvent) => e.date === dateStr;

            const hasContent = startEndEvents.length > 0 || ongoingEvents.length > 0 || singleEvents.length > 0;

            return !hasContent ? (
              <p className={styles.tabPlaceholder}>
                {new Date(dateStr + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}のイベントはありません
              </p>
            ) : (
              <div className={styles.eventListWrap}>
                {/* 初日・最終日の詳細カード */}
                {startEndEvents.map(evt => (
                  <div key={evt.id} className={`${styles.eventCard} ${isStart(evt) ? '' : styles.eventCardEnding}`}>
                    <div className={styles.eventCardHeader}>
                      <span className={styles.eventCardBadge} data-type={isStart(evt) ? 'start' : 'end'}>
                        {isStart(evt) ? '開始' : '終了'}
                      </span>
                      {evt.official_url ? (
                        <a href={evt.official_url} target="_blank" rel="noopener noreferrer" className={styles.eventCardLink}>{evt.name}</a>
                      ) : (
                        <span className={styles.eventCardName}>{evt.name}</span>
                      )}
                    </div>
                    {evt.official_url && <div className={styles.eventCardHint}>👆 タイトルタップで公式サイトへ</div>}
                    {evt.source_image_url && (
                      <div className={styles.eventCardImage}>
                        <img
                          src={evt.source_image_url.startsWith('http') ? evt.source_image_url : `${AUTH_BASE}${evt.source_image_url}`}
                          alt={evt.name}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className={styles.eventDetailGrid}>
                      <div className={styles.eventDetailRow}>
                        <span className={styles.eventDetailLabel}>期間</span>
                        <span className={styles.eventDetailValue}>{formatPeriod(evt)}</span>
                      </div>
                      <div className={styles.eventDetailRow}>
                        <span className={styles.eventDetailLabel}>種別</span>
                        <span className={styles.eventDetailValue}>{subCatLabel(evt.sub_category)}</span>
                      </div>
                      {evt.location && (
                        <div className={styles.eventDetailRow}>
                          <span className={styles.eventDetailLabel}>開催場所</span>
                          <span className={styles.eventDetailValue}>{evt.location}</span>
                        </div>
                      )}
                      {evt.duration && (
                        <div className={styles.eventDetailRow}>
                          <span className={styles.eventDetailLabel}>所要時間</span>
                          <span className={styles.eventDetailValue}>{evt.duration}</span>
                        </div>
                      )}
                      {evt.age_restriction && (
                        <div className={styles.eventDetailRow}>
                          <span className={styles.eventDetailLabel}>年齢制限</span>
                          <span className={styles.eventDetailValue}>{evt.age_restriction}</span>
                        </div>
                      )}
                      {evt.summary && (
                        <div className={styles.eventDetailRow}>
                          <span className={styles.eventDetailLabel}>概要</span>
                          <span className={styles.eventDetailValue}>{evt.summary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* 期間中のコンパクト表示 */}
                {ongoingEvents.length > 0 && (
                  <>
                    <div className={styles.eventGroupLabel}>📋 開催中の期間限定</div>
                    {ongoingEvents.map(evt => (
                      <details key={evt.id} className={styles.eventCompact}>
                        <summary className={styles.eventCompactSummary}>
                          <span className={styles.eventCompactEmoji}>{subCatEmoji(evt.sub_category)}</span>
                          {evt.official_url ? (
                            <a href={evt.official_url} target="_blank" rel="noopener noreferrer" className={styles.eventCompactLink} onClick={e => e.stopPropagation()}>{evt.name}</a>
                          ) : (
                            <span className={styles.eventCompactName}>{evt.name}</span>
                          )}
                          <span className={styles.eventCompactDate}>{formatEndDate(evt)}</span>
                        </summary>
                        <div className={styles.eventDetailGrid}>
                          <div className={styles.eventDetailRow}>
                            <span className={styles.eventDetailLabel}>期間</span>
                            <span className={styles.eventDetailValue}>{formatPeriod(evt)}</span>
                          </div>
                          <div className={styles.eventDetailRow}>
                            <span className={styles.eventDetailLabel}>種別</span>
                            <span className={styles.eventDetailValue}>{subCatLabel(evt.sub_category)}</span>
                          </div>
                          {evt.location && (
                            <div className={styles.eventDetailRow}>
                              <span className={styles.eventDetailLabel}>開催場所</span>
                              <span className={styles.eventDetailValue}>{evt.location}</span>
                            </div>
                          )}
                          {evt.summary && (
                            <div className={styles.eventDetailRow}>
                              <span className={styles.eventDetailLabel}>概要</span>
                              <span className={styles.eventDetailValue}>{evt.summary}</span>
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </>
                )}

                {/* 単発イベント */}
                {singleEvents.length > 0 && (
                  <>
                    <div className={styles.eventGroupLabel}>📌 単発イベント</div>
                    {singleEvents.map(evt => (
                      <div key={evt.id} className={styles.eventCard}>
                        <div className={styles.eventCardHeader}>
                          <span className={styles.eventCardEmoji}>{subCatEmoji(evt.sub_category)}</span>
                          {evt.official_url ? (
                            <a href={evt.official_url} target="_blank" rel="noopener noreferrer" className={styles.eventCardLink}>{evt.name}</a>
                          ) : (
                            <span className={styles.eventCardName}>{evt.name}</span>
                          )}
                        </div>
                        {evt.summary && <div className={styles.eventCardSummary}>{evt.summary}</div>}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })()}
        </div>
      ) : activeTab === 'restaurant' ? (
        <div className={styles.tabContent}>
          <RestaurantList restaurants={restaurants} isLoading={restaurantsLoading} />
        </div>
      ) : activeTab === 'shows' ? (
        <div className={styles.tabContent}>
          <ShowSchedule
            shows={shows}
            scheduleDate={scheduleDate}
            isLoading={showsLoading}
            today={today}
            planItems={planItems}
            onAddPlan={onAddPlan}
            parkEvents={parkEvents}
          />
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
