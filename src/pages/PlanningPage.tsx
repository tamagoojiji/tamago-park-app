import { useState } from 'react';
import type { PlanItem } from '../types';
import Calendar from '../components/Calendar';
import styles from './PlanningPage.module.css';

export default function PlanningPage() {
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  const handleAddPlan = (item: PlanItem) => {
    setPlanItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item].sort((a, b) => {
        const aTime = a.holdTime || a.time;
        const bTime = b.holdTime || b.time;
        return aTime.localeCompare(bTime);
      });
    });
  };

  const handleRemovePlan = (id: string) => {
    setPlanItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className={styles.container}>
      {/* プランニングタイムライン */}
      {planItems.length > 0 && (
        <section className={styles.timeline}>
          <h2 className={styles.timelineTitle}>今日のプラン</h2>
          <div className={styles.timelineList}>
            {planItems.map((item) => (
              <div key={item.id} className={styles.timelineGroup}>
                {/* 場所取り行 */}
                {item.holdTime && item.holdMinutes > 0 && (
                  <div className={`${styles.timelineItem} ${styles.holdItem}`}>
                    <div className={styles.timeCol}>
                      <span className={styles.timeText}>{item.holdTime}</span>
                      <div className={styles.timeLine} />
                    </div>
                    <div className={styles.itemContent}>
                      <span className={styles.holdLabel}>
                        (場所取り){item.showName}
                      </span>
                    </div>
                  </div>
                )}
                {/* ショー本体行 */}
                <div className={styles.timelineItem}>
                  <div className={styles.timeCol}>
                    <span className={styles.timeText}>{item.time}</span>
                    <div className={styles.timeLine} />
                  </div>
                  <div className={styles.itemContent}>
                    <span className={styles.showLabel}>{item.showName}</span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemovePlan(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ショータブ付きカレンダー */}
      <Calendar planItems={planItems} onAddPlan={handleAddPlan} />
    </main>
  );
}
