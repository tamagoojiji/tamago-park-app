import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

const EVENT_LABELS: Record<string, string> = {
  login: 'ログイン',
  signup: '新規登録',
  survey_complete: 'アンケート完了',
  plan_create: 'プラン作成',
};

type Analytics = Awaited<ReturnType<typeof adminApi.analytics>>;

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    adminApi.stats().then((s) => setStats(s as Record<string, unknown>));
  }, []);

  useEffect(() => {
    adminApi.analytics(days).then(setAnalytics).catch(console.error);
  }, [days]);

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

      {/* アクセス・コンバージョン分析 */}
      <div className={styles.headerRow}>
        <h3 className={styles.subTitle}>アクセス・コンバージョン分析</h3>
        <div className={styles.filterRow}>
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              className={styles.btn}
              style={days === d ? { opacity: 1 } : { opacity: 0.5 }}
              onClick={() => setDays(d)}
            >
              {d}日間
            </button>
          ))}
        </div>
      </div>

      {analytics && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.access.total}</span>
              <span className={styles.statLabel}>総アクセス数</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.access.uniqueUsers}</span>
              <span className={styles.statLabel}>ユニークユーザー</span>
            </div>
          </div>

          {/* コンバージョンサマリー */}
          {analytics.conversions.summary.length > 0 && (
            <>
              <h3 className={styles.subTitle}>コンバージョン</h3>
              <div className={styles.statsGrid}>
                {analytics.conversions.summary.map((c) => (
                  <div key={c.event_type} className={styles.statCard}>
                    <span className={styles.statValue}>{c.count}</span>
                    <span className={styles.statLabel}>{EVENT_LABELS[c.event_type] || c.event_type}（{c.unique_users}人）</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 日別アクセス推移 */}
          <h3 className={styles.subTitle}>日別アクセス推移</h3>
          <table className={styles.table}>
            <thead><tr><th>日付</th><th>アクセス数</th><th>ユニークユーザー</th></tr></thead>
            <tbody>
              {analytics.access.daily.map((d) => (
                <tr key={d.date}>
                  <td>{d.date}</td>
                  <td>{d.count}</td>
                  <td>{d.unique_users}</td>
                </tr>
              ))}
              {analytics.access.daily.length === 0 && (
                <tr><td colSpan={3} className={styles.empty}>データなし</td></tr>
              )}
            </tbody>
          </table>

          {/* エンドポイント別ランキング */}
          <h3 className={styles.subTitle}>エンドポイント別アクセス</h3>
          <table className={styles.table}>
            <thead><tr><th>パス</th><th>アクセス数</th><th>ユニーク</th></tr></thead>
            <tbody>
              {analytics.access.topEndpoints.map((e) => (
                <tr key={e.path}>
                  <td>{e.path}</td>
                  <td>{e.count}</td>
                  <td>{e.unique_users}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
