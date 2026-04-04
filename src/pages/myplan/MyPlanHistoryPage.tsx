import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { myplanApi } from '../../api/myplan';
import type { MyPlan } from '../../types/myplan';
import styles from './MyPlanHistoryPage.module.css';

type PlanWithId = MyPlan & { id: number };

export default function MyPlanHistoryPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    myplanApi.list(token)
      .then((res) => setPlans(res.plans))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token || !confirm('このプランを削除しますか？')) return;
    try {
      await myplanApi.delete(token, id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch { /* ignore */ }
  };

  // 月別グループ
  const grouped = plans.reduce<Record<string, PlanWithId[]>>((acc, plan) => {
    const month = plan.date.substring(0, 7); // "2026-04"
    if (!acc[month]) acc[month] = [];
    acc[month].push(plan);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>マイプラン履歴</h1>
          <p className={styles.loading}>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>マイプラン履歴</h1>

        <button
          className={styles.newPlanButton}
          onClick={() => navigate('/myplan')}
        >
          + 新しいプランを作成
        </button>

        {plans.length === 0 ? (
          <div className={styles.empty}>
            <p>まだプランがありません</p>
            <p className={styles.emptyHint}>「新しいプランを作成」から始めましょう</p>
          </div>
        ) : (
          Object.entries(grouped).map(([month, monthPlans]) => (
            <div key={month} className={styles.monthGroup}>
              <h2 className={styles.monthTitle}>
                {month.replace('-', '年')}月
              </h2>
              {monthPlans.map((plan) => (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planHeader}>
                    <span className={styles.planDate}>📅 {plan.date}</span>
                    <span className={styles.planHours}>{plan.openTime}〜{plan.closeTime}</span>
                  </div>
                  <div className={styles.planStats}>
                    <span>🎢 {plan.attractions.length}件</span>
                    <span>🎭 {plan.shows.length}件</span>
                  </div>
                  <div className={styles.planActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate(`/myplan?edit=${plan.id}`)}
                    >
                      編集
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(plan.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
