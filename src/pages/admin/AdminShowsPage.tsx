import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Record<string, { name: string; times: string[] }[]>>({});
  const [totalDates, setTotalDates] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState('');

  const load = () => {
    adminApi.shows().then((res) => {
      setShows(res.shows);
      setTotalDates(res.totalDates);
    });
  };

  useEffect(() => { load(); }, []);

  const handleFetch = async () => {
    setFetching(true);
    setFetchResult('');
    try {
      const res = await adminApi.fetchShows();
      setFetchResult(`${res.totalDays}日分のデータを取得しました`);
      load();
    } catch (err) {
      setFetchResult(err instanceof Error ? err.message : '取得失敗');
    } finally {
      setFetching(false);
    }
  };

  const dates = Object.keys(shows).sort();

  return (
    <div>
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>ショースケジュール ({totalDates}日分)</h2>
        <button className={styles.btn} onClick={handleFetch} disabled={fetching}>
          {fetching ? '取得中...' : 'USJ APIから取得'}
        </button>
      </div>
      {fetchResult && <p className={styles.message}>{fetchResult}</p>}

      {dates.map((date) => (
        <div key={date} className={styles.dateSection}>
          <h3 className={styles.dateTitle}>{date}</h3>
          <table className={styles.table}>
            <thead><tr><th>ショー名</th><th>時間</th></tr></thead>
            <tbody>
              {shows[date].map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.times.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
