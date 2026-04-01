import { useState, useEffect } from 'react';
import { checklistItems, getSeason, getActiveCategories, categoryLabels } from '../data/checklist';
import type { ChecklistCategory } from '../types';
import styles from './ChecklistPage.module.css';

const STORAGE_KEY = 'tamago_checklist_checked';

export default function ChecklistPage() {
  const now = new Date();
  const currentSeason = getSeason(now.getMonth() + 1);

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showRain, setShowRain] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const activeCategories = getActiveCategories(currentSeason, showRain);
  const activeItems = checklistItems.filter(item => activeCategories.includes(item.category));

  const totalCount = activeItems.length;
  const checkedCount = activeItems.filter(item => checked[item.id]).length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  function toggleItem(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function resetAll() {
    setChecked({});
  }

  function renderCategory(category: ChecklistCategory) {
    const items = activeItems.filter(item => item.category === category);
    if (items.length === 0) return null;
    const info = categoryLabels[category];
    const categoryChecked = items.filter(item => checked[item.id]).length;

    return (
      <div key={category} className={styles.categorySection}>
        <div className={styles.categoryHeader}>
          <span className={styles.categoryIcon}>{info.icon}</span>
          <span className={styles.categoryLabel} style={{ color: info.color }}>{info.label}</span>
          <span className={styles.categoryCount}>{categoryChecked}/{items.length}</span>
        </div>
        <div className={styles.itemList}>
          {items.map(item => (
            <label key={item.id} className={`${styles.item} ${checked[item.id] ? styles.itemChecked : ''}`}>
              <input
                type="checkbox"
                checked={!!checked[item.id]}
                onChange={() => toggleItem(item.id)}
                className={styles.checkbox}
              />
              <div className={styles.itemContent}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemDesc}>{item.description}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>✅ 持ち物チェックリスト</h1>
        <p className={styles.subtitle}>
          {categoryLabels[currentSeason].icon} 現在の季節: {categoryLabels[currentSeason].label}
        </p>

        {/* 進捗バー */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>{checkedCount}/{totalCount}（{progress}%）</span>
        </div>

        {/* 雨トグル */}
        <div className={styles.toggleRow}>
          <label className={styles.toggleLabel}>
            <span>☔ 雨・水濡れ対策を表示</span>
            <input
              type="checkbox"
              checked={showRain}
              onChange={() => setShowRain(!showRain)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch} />
          </label>
        </div>

        {/* カテゴリ別リスト */}
        {activeCategories.map(cat => renderCategory(cat))}

        {/* メモ */}
        <div className={styles.memo}>
          <div className={styles.memoTitle}>memo</div>
          <p>チケットは必ず写真の中にスクリーンショットで保存しておいてください。</p>
          <p>公式アプリへのチケット登録は、入場時は必要なく、入場後の「ニンテンドー整理券」「よやくのり」に必要になります！</p>
        </div>

        {/* リセット */}
        <button className={styles.resetButton} onClick={resetAll}>
          チェックをリセット
        </button>
      </div>
    </main>
  );
}
