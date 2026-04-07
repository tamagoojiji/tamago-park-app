import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

interface Stats {
  users: number;
  surveys: number;
  plans: number;
  events: number;
  todayShows: number;
  todaySurveys: number;
  todayPlans: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p>読み込み中...</p>;

  const cards = [
    { label: 'ユーザー数', value: stats.users, link: '/admin/users' },
    { label: 'アンケート数', value: stats.surveys, link: '/admin/surveys' },
    { label: 'マイプラン数', value: stats.plans, link: '/admin/stats' },
    { label: 'イベント数', value: stats.events, link: '/admin/events' },
    { label: '今日のショー', value: stats.todayShows, link: '/admin/shows' },
    { label: '今日のアンケート', value: stats.todaySurveys, link: '/admin/surveys' },
    { label: '今日のプラン', value: stats.todayPlans, link: '/admin/stats' },
  ];

  return (
    <div>
      <h2 className={styles.pageTitle}>ダッシュボード</h2>
      <div className={styles.statsGrid}>
        {cards.map((c) => (
          <Link to={c.link} key={c.label} className={styles.statCard}>
            <span className={styles.statValue}>{c.value}</span>
            <span className={styles.statLabel}>{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
