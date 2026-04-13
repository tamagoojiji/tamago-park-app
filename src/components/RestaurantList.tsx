import { useState } from 'react';
import type { RestaurantInfo } from '../api/restaurants';
import {
  RESTAURANT_GENRES,
  TABEARUKI_GENRES,
  RESTAURANT_GENRE_MAP,
  TABEARUKI_GENRE_MAP,
  RESTAURANT_IMAGE_MAP,
  TABEARUKI_IMAGE_MAP,
  CLOSED_RESTAURANTS,
  isTabearuki,
} from '../data/restaurant-genres';
import styles from './RestaurantList.module.css';

type Step = 'category' | 'genre' | 'result';
type Category = 'restaurant' | 'tabearuki';

interface Props {
  restaurants: RestaurantInfo[];
  isLoading: boolean;
}

export default function RestaurantList({ restaurants, isLoading }: Props) {
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<Category | null>(null);
  const [genreId, setGenreId] = useState<string | null>(null);
  const [selected, setSelected] = useState<RestaurantInfo | null>(null);

  // クローズ中を除外
  const activeRestaurants = restaurants.filter(
    (r) => !CLOSED_RESTAURANTS.has(r.restaurant_name)
  );

  if (isLoading) {
    return <p className={styles.placeholder}>レストラン情報を読み込み中...</p>;
  }

  if (activeRestaurants.length === 0) {
    return <p className={styles.placeholder}>レストラン情報がありません</p>;
  }

  const goBack = () => {
    if (step === 'result') {
      setStep('genre');
      setGenreId(null);
      setSelected(null);
    } else if (step === 'genre') {
      setStep('category');
      setCategory(null);
    }
  };

  const handleCategory = (cat: Category) => {
    setCategory(cat);
    setStep('genre');
  };

  const handleGenre = (id: string) => {
    setGenreId(id);
    setStep('result');
  };

  const getFilteredList = (): RestaurantInfo[] => {
    if (!category || !genreId) return [];
    const genreMap = category === 'restaurant' ? RESTAURANT_GENRE_MAP : TABEARUKI_GENRE_MAP;
    const isTabearukiCat = category === 'tabearuki';

    const catList = activeRestaurants.filter((r) =>
      isTabearukiCat ? isTabearuki(r.restaurant_name) : !isTabearuki(r.restaurant_name)
    );

    if (genreId === 'all') return catList;
    return catList.filter((r) => genreMap[r.restaurant_name] === genreId);
  };

  const genreLabel = () => {
    if (!category || !genreId) return '';
    const genres = category === 'restaurant' ? RESTAURANT_GENRES : TABEARUKI_GENRES;
    return genres.find((g) => g.id === genreId)?.label || '';
  };

  const getImage = (name: string): string | undefined => RESTAURANT_IMAGE_MAP[name];

  return (
    <>
      {step !== 'category' && (
        <button className={styles.backBtn} onClick={goBack}>
          ← 戻る
        </button>
      )}

      {/* Step 1: カテゴリ選択 */}
      {step === 'category' && (
        <>
          <p className={styles.stepTitle}>どちらを探しますか？</p>
          <div className={styles.categoryGrid}>
            <button className={styles.categoryCard} onClick={() => handleCategory('restaurant')}>
              <span className={styles.categoryIcon}>🍽️</span>
              <span className={styles.categoryLabel}>レストラン</span>
            </button>
            <button className={styles.categoryCard} onClick={() => handleCategory('tabearuki')}>
              <span className={styles.categoryIcon}>🍢</span>
              <span className={styles.categoryLabel}>食べ歩きフード</span>
            </button>
          </div>
        </>
      )}

      {/* Step 2: ジャンル選択 */}
      {step === 'genre' && category && (
        <>
          <p className={styles.stepTitle}>
            {category === 'restaurant' ? 'ジャンルを選んでください' : 'フードを選んでください'}
          </p>
          <div className={styles.genreGrid}>
            {(category === 'restaurant' ? RESTAURANT_GENRES : TABEARUKI_GENRES).map((g) => {
              const genreImage = category === 'tabearuki' ? TABEARUKI_IMAGE_MAP[g.id] : undefined;
              return (
                <button
                  key={g.id}
                  className={styles.genreCard}
                  onClick={() => handleGenre(g.id)}
                >
                  {genreImage ? (
                    <img src={genreImage} alt={g.label} className={styles.genreImg} />
                  ) : (
                    <span className={styles.genreIcon}>{g.icon}</span>
                  )}
                  <span className={styles.genreLabel}>{g.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Step 3: 結果一覧 */}
      {step === 'result' && (
        <>
          <p className={styles.stepTitle}>{genreLabel()}</p>
          {(() => {
            const list = getFilteredList();
            if (list.length === 0) {
              return <p className={styles.placeholder}>該当するお店がありません</p>;
            }
            return (
              <>
                <p className={styles.resultCount}>{list.length}件</p>
                <div className={styles.resultList}>
                  {list.map((r) => {
                    const img = getImage(r.restaurant_name);
                    return (
                      <button
                        key={r.restaurant_name}
                        className={styles.resultCard}
                        onClick={() => setSelected(r)}
                      >
                        {img ? (
                          <img src={img} alt={r.restaurant_name} className={styles.resultImg} />
                        ) : (
                          <span className={styles.resultIcon}>
                            {category === 'tabearuki' ? '🍢' : '🍽️'}
                          </span>
                        )}
                        <div className={styles.resultInfo}>
                          <span className={styles.resultName}>{r.restaurant_name}</span>
                          {r.open_time && r.close_time && (
                            <span className={styles.resultTime}>
                              {r.open_time}〜{r.close_time}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.mapPlaceholder}>
                  <span className={styles.mapIcon}>🗺️</span>
                  <span>MAP準備中</span>
                </div>
              </>
            );
          })()}
        </>
      )}

      {/* ボトムシート */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>
              ×
            </button>
            <div className={styles.sheetContent}>
              {getImage(selected.restaurant_name) ? (
                <img
                  src={getImage(selected.restaurant_name)}
                  alt={selected.restaurant_name}
                  className={styles.sheetImg}
                />
              ) : (
                <span className={styles.sheetIcon}>
                  {isTabearuki(selected.restaurant_name) ? '🍢' : '🍽️'}
                </span>
              )}
              <h3 className={styles.sheetName}>{selected.restaurant_name}</h3>
              <span className={styles.sheetCategory}>
                {isTabearuki(selected.restaurant_name) ? '食べ歩き' : 'レストラン'}
              </span>
              {selected.dining_type && (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>ジャンル</span>
                  <span className={styles.sheetValue}>{selected.dining_type}</span>
                </div>
              )}
              {selected.open_time && selected.close_time && (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>営業時間</span>
                  <span className={styles.sheetValue}>
                    {selected.open_time}〜{selected.close_time}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
