import { useState } from 'react';
import { heightRestrictions, type HeightRestriction } from '../data/height-restrictions';
import styles from './HeightPage.module.css';

const HEIGHT_OPTIONS = [0, 92, 102, 107, 122, 132];

export default function HeightPage() {
  const [childHeight, setChildHeight] = useState<number>(0);

  // 身長でフィルタ: 単独 or 付き添いありで乗れるかを判定
  const getRideStatus = (r: HeightRestriction): 'alone' | 'with_adult' | 'ng' => {
    if (childHeight === 0) return 'alone'; // フィルタなし
    if (childHeight >= r.aloneMin) return 'alone';
    if (r.withAdultMin > 0 && childHeight >= r.withAdultMin) return 'with_adult';
    return 'ng';
  };

  // 身長制限が高い順にソート
  const sorted = [...heightRestrictions].sort((a, b) => {
    if (b.aloneMin !== a.aloneMin) return b.aloneMin - a.aloneMin;
    return a.name.localeCompare(b.name);
  });

  const rideableCount = childHeight > 0
    ? sorted.filter(r => getRideStatus(r) !== 'ng').length
    : sorted.length;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>身長制限リスト</h1>

      {/* 身長フィルタ */}
      <div className={styles.filterCard}>
        <p className={styles.filterLabel}>お子さまの身長で絞り込み</p>
        <div className={styles.heightButtons}>
          <button
            className={`${styles.heightBtn} ${childHeight === 0 ? styles.heightBtnActive : ''}`}
            onClick={() => setChildHeight(0)}
          >
            すべて
          </button>
          {HEIGHT_OPTIONS.filter(h => h > 0).map(h => (
            <button
              key={h}
              className={`${styles.heightBtn} ${childHeight === h ? styles.heightBtnActive : ''}`}
              onClick={() => setChildHeight(h)}
            >
              {h}cm
            </button>
          ))}
        </div>
        {childHeight > 0 && (
          <p className={styles.filterResult}>
            {childHeight}cm → <strong>{rideableCount}件</strong>のアトラクションに乗れます
          </p>
        )}
      </div>

      {/* アトラクション一覧 */}
      <div className={styles.list}>
        {sorted.map((r) => {
          const status = getRideStatus(r);
          if (childHeight > 0 && status === 'ng') return null;

          return (
            <div key={r.name} className={`${styles.rideCard} ${childHeight > 0 ? styles[`status_${status}`] : ''}`}>
              <div className={styles.rideTop}>
                {r.image && <img src={r.image} alt={r.name} className={styles.rideImage} loading="lazy" />}
                <div className={styles.rideHeader}>
                  <span className={styles.rideName}>{r.name}</span>
                  <span className={styles.rideArea}>{r.area}</span>
                </div>
              </div>
              <div className={styles.rideInfo}>
                <span className={styles.heightBadge}>
                  {r.aloneMin}cm~
                </span>
                {r.withAdultMin > 0 && r.withAdultMin < r.aloneMin && (
                  <span className={styles.withAdultBadge}>
                    付き添いあり {r.withAdultMin}cm~
                  </span>
                )}
                {status === 'with_adult' && (
                  <span className={styles.statusBadge}>付き添い必要</span>
                )}
              </div>
              <div className={styles.rideTags}>
                {r.childSwap && <span className={styles.tag}>チャイルドスイッチ</span>}
                {r.singleRider && <span className={styles.tag}>シングルライダー</span>}
              </div>
            </div>
          );
        })}
      </div>

      <p className={styles.note}>
        ※ 身長制限のないアトラクションは省略しています
      </p>
    </main>
  );
}
