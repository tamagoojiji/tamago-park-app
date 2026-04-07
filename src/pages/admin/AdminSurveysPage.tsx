import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  const load = (p: number) => {
    adminApi.surveys(p, 50, dateFrom, dateTo).then((res) => {
      setSurveys(res.surveys);
      setTotal(res.total);
      setPage(p);
    });
  };

  useEffect(() => { load(1); }, []);

  const openDetail = async (id: number) => {
    const res = await adminApi.surveyDetail(id);
    setDetail(res);
  };

  if (detail) {
    const answers = detail.answers as Record<string, unknown>;
    return (
      <div>
        <button className={styles.backBtn} onClick={() => setDetail(null)}>← 一覧に戻る</button>
        <h2 className={styles.pageTitle}>アンケート #{String(detail.id)}</h2>
        <table className={styles.table}>
          <tbody>
            <tr><td>ユーザー</td><td>{String(detail.display_name || '-')}</td></tr>
            <tr><td>来園日</td><td>{String(detail.visit_date)}</td></tr>
            <tr><td>種別</td><td>{String(detail.service_type)}</td></tr>
            <tr><td>GAS同期</td><td>{detail.gas_synced ? '済' : '未'}</td></tr>
            <tr><td>回答日</td><td>{String(detail.created_at)}</td></tr>
          </tbody>
        </table>
        <h3 className={styles.subTitle}>回答内容</h3>
        <pre className={styles.jsonBlock}>{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  }

  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      <h2 className={styles.pageTitle}>アンケート一覧 ({total}件)</h2>
      <div className={styles.filterRow}>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={styles.input} />
        <span>〜</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={styles.input} />
        <button className={styles.btn} onClick={() => load(1)}>絞込</button>
      </div>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>ユーザー</th><th>来園日</th><th>種別</th><th>GAS</th><th>回答日</th><th></th></tr></thead>
        <tbody>
          {surveys.map((s) => (
            <tr key={String(s.id)}>
              <td>{String(s.id)}</td>
              <td>{String(s.display_name || '-')}</td>
              <td>{String(s.visit_date)}</td>
              <td>{String(s.service_type)}</td>
              <td>{s.gas_synced ? '済' : '未'}</td>
              <td>{String(s.created_at).slice(0, 10)}</td>
              <td><button className={styles.linkBtn} onClick={() => openDetail(Number(s.id))}>詳細</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => load(page - 1)} className={styles.btn}>前へ</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1)} className={styles.btn}>次へ</button>
        </div>
      )}
    </div>
  );
}
