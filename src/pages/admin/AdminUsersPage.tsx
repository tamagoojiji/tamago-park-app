import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import styles from './Admin.module.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  const load = (p: number, s: string) => {
    adminApi.users(p, 50, s).then((res) => {
      setUsers(res.users);
      setTotal(res.total);
      setPage(p);
    });
  };

  useEffect(() => { load(1, ''); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(1, search);
  };

  const openDetail = async (id: number) => {
    const res = await adminApi.userDetail(id);
    setDetail(res as Record<string, unknown>);
  };

  if (detail) {
    const u = detail.user as Record<string, unknown>;
    const surveys = detail.surveys as Record<string, unknown>[];
    const plans = detail.plans as Record<string, unknown>[];
    return (
      <div>
        <button className={styles.backBtn} onClick={() => setDetail(null)}>← 一覧に戻る</button>
        <h2 className={styles.pageTitle}>{String(u.display_name || '名前なし')}</h2>
        <table className={styles.table}>
          <tbody>
            <tr><td>ID</td><td>{String(u.id)}</td></tr>
            <tr><td>LINE UID</td><td>{String(u.line_uid)}</td></tr>
            <tr><td>誕生日</td><td>{String(u.birthday || '未設定')}</td></tr>
            <tr><td>性別</td><td>{String(u.gender || '未設定')}</td></tr>
            <tr><td>登録日</td><td>{String(u.created_at)}</td></tr>
          </tbody>
        </table>

        <h3 className={styles.subTitle}>アンケート ({surveys.length}件)</h3>
        {surveys.length > 0 ? (
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>来園日</th><th>種別</th><th>GAS同期</th><th>回答日</th></tr></thead>
            <tbody>
              {surveys.map((s) => (
                <tr key={String(s.id)}>
                  <td>{String(s.id)}</td><td>{String(s.visit_date)}</td>
                  <td>{String(s.service_type)}</td><td>{s.gas_synced ? '済' : '未'}</td>
                  <td>{String(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className={styles.empty}>なし</p>}

        <h3 className={styles.subTitle}>マイプラン ({plans.length}件)</h3>
        {plans.length > 0 ? (
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>日付</th><th>名前</th><th>時間</th><th>作成日</th></tr></thead>
            <tbody>
              {plans.map((p) => (
                <tr key={String(p.id)}>
                  <td>{String(p.id)}</td><td>{String(p.date)}</td>
                  <td>{String(p.name || '-')}</td>
                  <td>{String(p.openTime)}〜{String(p.closeTime)}</td>
                  <td>{String(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className={styles.empty}>なし</p>}
      </div>
    );
  }

  const totalPages = Math.ceil(total / 50);

  return (
    <div>
      <h2 className={styles.pageTitle}>ユーザー一覧 ({total}件)</h2>
      <form className={styles.filterRow} onSubmit={handleSearch}>
        <input
          type="text" placeholder="名前・UID検索" value={search}
          onChange={(e) => setSearch(e.target.value)} className={styles.input}
        />
        <button type="submit" className={styles.btn}>検索</button>
      </form>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>表示名</th><th>性別</th><th>登録日</th><th></th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={String(u.id)}>
              <td>{String(u.id)}</td>
              <td>{String(u.display_name || '-')}</td>
              <td>{String(u.gender || '-')}</td>
              <td>{String(u.created_at).slice(0, 10)}</td>
              <td><button className={styles.linkBtn} onClick={() => openDetail(Number(u.id))}>詳細</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page <= 1} onClick={() => load(page - 1, search)} className={styles.btn}>前へ</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => load(page + 1, search)} className={styles.btn}>次へ</button>
        </div>
      )}
    </div>
  );
}
