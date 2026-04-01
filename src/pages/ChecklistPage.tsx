import { useState, useEffect } from 'react';
import { checklistItems, getSeason, getActiveCategories, categoryLabels } from '../data/checklist';
import type { ChecklistCategory, Season } from '../types';
import styles from './ChecklistPage.module.css';

const STORAGE_KEY = 'tamago_checklist_checked';

const seasonOptions: { value: Season; label: string; icon: string }[] = [
  { value: 'spring', label: '春（3〜5月）', icon: '🌸' },
  { value: 'summer', label: '夏（6〜8月）', icon: '☀️' },
  { value: 'autumn', label: '秋（9〜11月）', icon: '🍂' },
  { value: 'winter', label: '冬（12〜2月）', icon: '❄️' },
];

export default function ChecklistPage() {
  const now = new Date();
  const currentSeason = getSeason(now.getMonth() + 1);

  const [selectedSeason, setSelectedSeason] = useState<Season>(currentSeason);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [showRain, setShowRain] = useState(false);
  const [showKids, setShowKids] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const activeCategories = getActiveCategories(selectedSeason, showRain, showKids);
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

  function handlePrint() {
    window.print();
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

  const seasonInfo = categoryLabels[selectedSeason];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>✅ 持ち物チェックリスト</h1>

        {/* 季節選択 */}
        <div className={styles.seasonSelector}>
          {seasonOptions.map(opt => (
            <button
              key={opt.value}
              className={`${styles.seasonButton} ${selectedSeason === opt.value ? styles.seasonButtonActive : ''}`}
              onClick={() => setSelectedSeason(opt.value)}
            >
              <span className={styles.seasonButtonIcon}>{opt.icon}</span>
              <span className={styles.seasonButtonLabel}>{opt.label}</span>
              {opt.value === currentSeason && <span className={styles.seasonNowBadge}>今</span>}
            </button>
          ))}
        </div>

        {/* 印刷ヘッダー（画面では非表示、印刷時のみ表示） */}
        <div className={styles.printHeader}>
          <div className={styles.printTitle}>USJ 完璧準備リスト</div>
          <div className={styles.printSeason}>{seasonInfo.icon} {seasonInfo.label}</div>
          <div className={styles.printFooter}>Planning by たまご</div>
        </div>

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

        {/* トグル */}
        <div className={styles.toggleRow}>
          <label className={styles.toggleLabel}>
            <span>👶 子連れアイテムを表示</span>
            <input
              type="checkbox"
              checked={showKids}
              onChange={() => setShowKids(!showKids)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSwitch} />
          </label>
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

        {/* 印刷・リセットボタン */}
        <div className={styles.actionButtons}>
          <button className={styles.printButton} onClick={handlePrint}>
            🖨️ チェックリストを印刷
          </button>
          <button className={styles.resetButton} onClick={resetAll}>
            チェックをリセット
          </button>
        </div>
      </div>
    </main>
  );
}
