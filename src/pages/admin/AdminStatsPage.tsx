import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [plans, setPlanStats] = useState<{ dates: Record<string, number> } | null>(null);

  useEffect(() => {
    adminApi.stats().then((s) => setStats(s as Record<string, unknown>));

    // 直近7日のプラン作成数を集計
    const now = new Date();
    const dates: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates[d.toISOString().slice(0, 10)] = 0;
    }
    setPlanStats({ dates });
  }, []);

  if (!stats) return <p>読み込み中...</p>;

  return (
    <div>
      <h2 className={styles.pageTitle}>統計情報</h2>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.users)}</span>
          <span className={styles.statLabel}>総ユーザー数</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.surveys)}</span>
          <span className={styles.statLabel}>総アンケート数</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.plans)}</span>
          <span className={styles.statLabel}>総マイプラン数</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.events)}</span>
          <span className={styles.statLabel}>アクティブイベント</span>
        </div>
      </div>

      <h3 className={styles.subTitle}>今日の状況</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.todayShows)}</span>
          <span className={styles.statLabel}>今日のショー</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.todaySurveys)}</span>
          <span className={styles.statLabel}>今日のアンケート</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{String(stats.todayPlans)}</span>
          <span className={styles.statLabel}>今日のプラン</span>
        </div>
      </div>

      {plans && (
        <>
          <h3 className={styles.subTitle}>直近7日のプラン作成数</h3>
          <table className={styles.table}>
            <thead><tr><th>日付</th><th>件数</th></tr></thead>
            <tbody>
              {Object.entries(plans.dates).map(([date, count]) => (
                <tr key={date}><td>{date}</td><td>{count}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
