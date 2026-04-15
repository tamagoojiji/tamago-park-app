import { useMemo } from 'react';
import type { PlanItem } from '../types';
import type { ShowData } from '../api/shows';
import type { ParkEvent } from '../api/events';
import { getLimitedShows } from '../api/events';
import { getHoldMinutes, showTemplates, isOpenShow } from '../data/shows';
import { useCurrentTime } from '../hooks/useCurrentTime';
import { useShowFavorites } from '../hooks/useShowFavorites';
import styles from './ShowSchedule.module.css';

interface ShowScheduleProps {
  shows: ShowData[];
  scheduleDate: string | null;
  isLoading: boolean;
  today: string;
  planItems: PlanItem[];
  onAddPlan?: (item: PlanItem) => void;
  parkEvents: ParkEvent[];
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

type ClassifiedShows = {
  favUpcoming: ShowData[];
  normalUpcoming: ShowData[];
  favFinished: ShowData[];
  normalFinished: ShowData[];
  favOther: ShowData[];
  normalOther: ShowData[];
  openShows: ShowData[];
};

export default function ShowSchedule({
  shows,
  scheduleDate,
  isLoading,
  today,
  planItems,
  onAddPlan,
  parkEvents,
}: ShowScheduleProps) {
  const currentMinutes = useCurrentTime();
  const { isFav, toggleFav } = useShowFavorites();

  const isToday = scheduleDate === today;

  const classified = useMemo<ClassifiedShows>(() => {
    const openShows = shows.filter((s) => isOpenShow(s));
    const regularShows = shows.filter((s) => !isOpenShow(s));

    if (isToday) {
      const upcoming: ShowData[] = [];
      const finished: ShowData[] = [];
      regularShows.forEach((show) => {
        const hasUpcoming = show.times.some(
          (t) => timeToMinutes(t) >= currentMinutes,
        );
        if (hasUpcoming) {
          upcoming.push(show);
        } else {
          finished.push(show);
        }
      });
      // Sort upcoming by next show time
      upcoming.sort((a, b) => {
        const aNext =
          a.times.find((t) => timeToMinutes(t) >= currentMinutes) ||
          a.times[0];
        const bNext =
          b.times.find((t) => timeToMinutes(t) >= currentMinutes) ||
          b.times[0];
        return timeToMinutes(aNext) - timeToMinutes(bNext);
      });

      return {
        favUpcoming: upcoming.filter((s) => isFav(s.name)),
        normalUpcoming: upcoming.filter((s) => !isFav(s.name)),
        favFinished: finished.filter((s) => isFav(s.name)),
        normalFinished: finished.filter((s) => !isFav(s.name)),
        favOther: [],
        normalOther: [],
        openShows,
      };
    } else {
      return {
        favUpcoming: [],
        normalUpcoming: [],
        favFinished: [],
        normalFinished: [],
        favOther: regularShows.filter((s) => isFav(s.name)),
        normalOther: regularShows.filter((s) => !isFav(s.name)),
        openShows,
      };
    }
  }, [shows, isToday, currentMinutes, isFav]);

  const isPlanAdded = (showName: string, time: string) =>
    planItems.some((p) => p.showName === showName && p.time === time);

  const handleAddShowToPlan = (showName: string, time: string) => {
    if (!onAddPlan || isPlanAdded(showName, time)) return;
    const holdMin = getHoldMinutes(showName);
    const holdTime =
      holdMin > 0 ? minutesToTime(timeToMinutes(time) - holdMin) : undefined;
    onAddPlan({
      id: `${showName}_${time}`,
      showName,
      time,
      holdTime,
      holdMinutes: holdMin,
    });
  };

  // Determine time chip status for today
  const getTimeChipClass = (
    show: ShowData,
    time: string,
    timeIndex: number,
  ): string => {
    const added = isPlanAdded(show.name, time);
    if (added) return `${styles.timeChip} ${styles.timeChipAdded}`;
    if (!isToday) return styles.timeChip;

    const mins = timeToMinutes(time);
    if (mins < currentMinutes) return `${styles.timeChip} ${styles.timeChipPast}`;

    // Is this the FIRST upcoming time for this show?
    const firstUpcomingIdx = show.times.findIndex(
      (t) => timeToMinutes(t) >= currentMinutes,
    );
    if (timeIndex === firstUpcomingIdx)
      return `${styles.timeChip} ${styles.timeChipNext}`;

    return styles.timeChip;
  };

  const renderShowCard = (show: ShowData, animIndex: number) => {
    const fav = isFav(show.name);
    const holdMin = getHoldMinutes(show.name);

    return (
      <div
        key={show.name}
        className={`${styles.showCard} ${fav ? styles.showCardFav : ''}`}
        style={{ animationDelay: `${animIndex * 30}ms` }}
      >
        <div className={styles.cardTop}>
          <div className={styles.showName}>{show.name}</div>
          <button
            className={`${styles.favBtn} ${fav ? styles.favBtnActive : ''}`}
            onClick={() => toggleFav(show.name)}
            aria-label={fav ? 'お気に入り解除' : 'お気に入り追加'}
          >
            {fav ? '★' : '☆'}
          </button>
        </div>
        {holdMin > 0 ? (
          <div className={styles.holdBadge}>場所取り {holdMin}分前〜</div>
        ) : show.name in showTemplates ? (
          <div className={`${styles.holdBadge} ${styles.holdBadgeNone}`}>
            場所取り不要
          </div>
        ) : null}
        <div className={styles.times}>
          {show.times.map((time, i) => {
            const added = isPlanAdded(show.name, time);
            return (
              <button
                key={time}
                className={getTimeChipClass(show, time, i)}
                onClick={() => handleAddShowToPlan(show.name, time)}
                disabled={!onAddPlan}
              >
                {time}
                {added && <span className={styles.timeCheck}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOpenCard = (show: ShowData, animIndex: number) => {
    const fav = isFav(show.name);
    return (
      <div
        key={show.name}
        className={`${styles.openCard} ${fav ? styles.openCardFav : ''}`}
        style={{ animationDelay: `${animIndex * 30}ms` }}
      >
        <div className={styles.cardTop}>
          <span className={styles.openName}>
            {show.name}
            <span className={styles.openTime}>
              {show.endTime ? `${show.times[0]} 〜 ${show.endTime}` : `${show.times[0]}〜`}
            </span>
          </span>
          <button
            className={`${styles.favBtn} ${fav ? styles.favBtnActive : ''}`}
            onClick={() => toggleFav(show.name)}
            aria-label={fav ? 'お気に入り解除' : 'お気に入り追加'}
          >
            {fav ? '★' : '☆'}
          </button>
        </div>
      </div>
    );
  };

  // Loading / empty states
  if (isLoading) {
    return <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>ショースケジュールを読み込み中...</p>;
  }
  if (shows.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#888', padding: '20px 0' }}>
        {scheduleDate
          ? `${new Date(scheduleDate + 'T00:00:00').toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}のスケジュールはまだありません`
          : '日付をタップしてショースケジュールを確認'}
      </p>
    );
  }

  const totalCount = shows.length;
  const limitedShows = getLimitedShows(parkEvents, scheduleDate || today);

  let animIdx = 0;

  return (
    <div className={styles.wrap}>
      {/* 日付 + 公式リンク + ショー数 */}
      <div className={styles.dateRow}>
        {scheduleDate && (
          <span className={styles.dateLabel}>
            {new Date(scheduleDate + 'T00:00:00').toLocaleDateString('ja-JP', {
              month: 'long',
              day: 'numeric',
            })}の情報
            <a
              href={`https://www.usj.co.jp/web/ja/jp/attractions/show-and-attraction-schedule?date=${scheduleDate}#timetable`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.officialLink}
            >
              公式情報 ↗
            </a>
          </span>
        )}
        <span className={styles.countBadge}>
          全 <strong>{totalCount}</strong> 件
        </span>
      </div>

      {/* 凡例（当日のみ） */}
      {isToday && (
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotNext}`} />
            次の回
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotPast}`} />
            終了
          </div>
        </div>
      )}

      {/* 当日表示 */}
      {isToday && (
        <>
          {classified.favUpcoming.length > 0 && (
            <>
              <div className={`${styles.sectionHeader} ${styles.sectionFav}`}>
                ★ お気に入り × これから（{classified.favUpcoming.length}件）
              </div>
              {classified.favUpcoming.map((s) => renderShowCard(s, animIdx++))}
            </>
          )}
          {classified.normalUpcoming.length > 0 && (
            <>
              <div
                className={`${styles.sectionHeader} ${styles.sectionUpcoming}`}
              >
                これからのショー（{classified.normalUpcoming.length}件）
              </div>
              {classified.normalUpcoming.map((s) =>
                renderShowCard(s, animIdx++),
              )}
            </>
          )}
          {classified.favFinished.length > 0 && (
            <>
              <div className={`${styles.sectionHeader} ${styles.sectionFav}`}>
                ★ お気に入り × 終了（{classified.favFinished.length}件）
              </div>
              {classified.favFinished.map((s) => renderShowCard(s, animIdx++))}
            </>
          )}
          {classified.normalFinished.length > 0 && (
            <>
              <div
                className={`${styles.sectionHeader} ${styles.sectionFinished}`}
              >
                終了したショー（{classified.normalFinished.length}件）
              </div>
              {classified.normalFinished.map((s) =>
                renderShowCard(s, animIdx++),
              )}
            </>
          )}
        </>
      )}

      {/* 当日以外 */}
      {!isToday && (
        <>
          {classified.favOther.length > 0 && (
            <>
              <div className={`${styles.sectionHeader} ${styles.sectionFav}`}>
                ★ お気に入り（{classified.favOther.length}件）
              </div>
              {classified.favOther.map((s) => renderShowCard(s, animIdx++))}
            </>
          )}
          {classified.normalOther.length > 0 && (
            <>
              {classified.favOther.length > 0 && (
                <div
                  className={`${styles.sectionHeader} ${styles.sectionUpcoming}`}
                >
                  その他（{classified.normalOther.length}件）
                </div>
              )}
              {classified.normalOther.map((s) => renderShowCard(s, animIdx++))}
            </>
          )}
        </>
      )}

      {/* OPEN時間 */}
      {classified.openShows.length > 0 && (
        <>
          <div className={`${styles.sectionHeader} ${styles.sectionOpen}`}>
            OPEN時間（{classified.openShows.length}件）
          </div>
          {classified.openShows.map((s) => renderOpenCard(s, animIdx++))}
        </>
      )}

      {/* 期間限定ショー */}
      {limitedShows.length > 0 && (
        <>
          <div className={styles.limitedLabel}>🎭 期間限定ショー</div>
          {limitedShows.map((evt) => (
            <div key={evt.id} className={styles.showCard}>
              <div className={styles.limitedName}>
                ✨{' '}
                {evt.official_url ? (
                  <a
                    href={evt.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.limitedLink}
                  >
                    {evt.name}
                  </a>
                ) : (
                  evt.name
                )}
              </div>
              {evt.summary && (
                <div className={styles.limitedSummary}>{evt.summary}</div>
              )}
              {evt.official_url && (
                <div className={styles.limitedHint}>
                  👆 タイトルタップで公式サイトへ
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

