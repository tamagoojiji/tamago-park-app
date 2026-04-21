import { useEffect, useState } from 'react';
import type { RestaurantInfo, MenuItem } from '../api/restaurants';
import { fetchStoreMenus } from '../api/restaurants';
import {
  RESTAURANT_GENRES,
  TABEARUKI_GENRES,
  RESTAURANT_GENRE_MAP,
  RESTAURANT_IMAGE_MAP,
  TABEARUKI_IMAGE_MAP,
  CLOSED_RESTAURANTS,
  isTabearuki,
} from '../data/restaurant-genres';
import { TABEARUKI_MENU, type TabearukiItem } from '../data/tabearuki-menu';
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
  const [selectedMenu, setSelectedMenu] = useState<TabearukiItem | null>(null);
  const [storeMenus, setStoreMenus] = useState<MenuItem[] | null>(null);
  const [isMenusLoading, setIsMenusLoading] = useState(false);

  useEffect(() => {
    if (!selected) {
      setStoreMenus(null);
      return;
    }
    let cancelled = false;
    setIsMenusLoading(true);
    fetchStoreMenus(selected.restaurant_name)
      .then((data) => {
        if (!cancelled) setStoreMenus(data.menus);
      })
      .catch(() => {
        if (!cancelled) setStoreMenus([]);
      })
      .finally(() => {
        if (!cancelled) setIsMenusLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  const activeRestaurants = restaurants.filter(
    (r) => !CLOSED_RESTAURANTS.has(r.restaurant_name)
  );

  if (isLoading) {
    return <p className={styles.placeholder}>レストラン情報を読み込み中...</p>;
  }

  if (activeRestaurants.length === 0 && TABEARUKI_MENU.length === 0) {
    return <p className={styles.placeholder}>レストラン情報がありません</p>;
  }

  const goBack = () => {
    if (step === 'result') {
      setStep('genre');
      setGenreId(null);
      setSelected(null);
      setSelectedMenu(null);
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

  // レストラン用フィルタ
  const getFilteredRestaurants = (): RestaurantInfo[] => {
    if (!genreId) return [];
    const catList = activeRestaurants.filter((r) => !isTabearuki(r.restaurant_name));
    if (genreId === 'all') return catList;
    return catList.filter((r) => {
      const genres = RESTAURANT_GENRE_MAP[r.restaurant_name];
      return genres && genres.includes(genreId);
    });
  };

  // 食べ歩きメニュー用フィルタ（販売停止中は除外）
  const getFilteredMenu = (): TabearukiItem[] => {
    if (!genreId) return [];
    return TABEARUKI_MENU.filter((m) => m.genre === genreId && !m.suspended);
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
              <img src="/images/category-restaurant.png" alt="レストラン" className={styles.categoryImg} />
              <span className={styles.categoryLabel}>レストラン</span>
            </button>
            <button className={styles.categoryCard} onClick={() => handleCategory('tabearuki')}>
              <img src="/images/category-tabearuki.png" alt="食べ歩きフード" className={styles.categoryImg} />
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
          {category === 'restaurant' ? (
            <div className={styles.genreTabs}>
              {RESTAURANT_GENRES.map((g) => (
                <button
                  key={g.id}
                  className={styles.genreTab}
                  onClick={() => handleGenre(g.id)}
                >
                  <span className={styles.genreTabIcon}>{g.icon}</span>
                  <span className={styles.genreTabLabel}>{g.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.genreGrid}>
              {TABEARUKI_GENRES.map((g) => {
                const genreImage = TABEARUKI_IMAGE_MAP[g.id];
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
          )}
        </>
      )}

      {/* Step 3: 結果一覧 */}
      {step === 'result' && (
        <>
          <p className={styles.stepTitle}>{genreLabel()}</p>

          {/* レストラン結果 */}
          {category === 'restaurant' && (() => {
            const list = getFilteredRestaurants();
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
                          <span className={styles.resultIcon}>🍽️</span>
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

          {/* 食べ歩きメニュー結果 */}
          {category === 'tabearuki' && (() => {
            const menuList = getFilteredMenu();
            if (menuList.length === 0) {
              return <p className={styles.placeholder}>メニュー情報は準備中です</p>;
            }
            return (
              <>
                <p className={styles.resultCount}>{menuList.length}品</p>
                <div className={styles.resultList}>
                  {menuList.map((m) => (
                    <button
                      key={`${m.shop}-${m.name}`}
                      className={styles.menuCard}
                      onClick={() => setSelectedMenu(m)}
                    >
                      <div className={styles.menuInfo}>
                        <span className={styles.menuName}>{m.name}</span>
                        <span className={styles.menuPrice}>¥{m.price.toLocaleString()}</span>
                        <span className={styles.menuShop}>📍 {m.shop}</span>
                      </div>
                    </button>
                  ))}
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

      {/* ボトムシート（レストラン） */}
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
                <span className={styles.sheetIcon}>🍽️</span>
              )}
              <h3 className={styles.sheetName}>{selected.restaurant_name}</h3>
              <span className={styles.sheetCategory}>レストラン</span>
              {selected.open_time && selected.close_time && (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>営業時間</span>
                  <span className={styles.sheetValue}>
                    {selected.open_time}〜{selected.close_time}
                  </span>
                </div>
              )}

              <div className={styles.sheetMenuSection}>
                <div className={styles.sheetLabel}>メニュー</div>
                {isMenusLoading && <p className={styles.sheetMenuPlaceholder}>読み込み中...</p>}
                {!isMenusLoading && storeMenus && storeMenus.length === 0 && (
                  <p className={styles.sheetMenuPlaceholder}>メニュー情報は準備中です</p>
                )}
                {!isMenusLoading && storeMenus && storeMenus.length > 0 && (
                  <ul className={styles.sheetMenuList}>
                    {storeMenus.map((m) => (
                      <li key={m.id} className={styles.sheetMenuItem}>
                        <span className={styles.sheetMenuName}>{m.menu_name}</span>
                        {m.price != null && (
                          <span className={styles.sheetMenuPrice}>¥{m.price.toLocaleString()}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ボトムシート（食べ歩きメニュー） */}
      {selectedMenu && (
        <div className={styles.overlay} onClick={() => setSelectedMenu(null)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedMenu(null)}>
              ×
            </button>
            <div className={styles.sheetContent}>
              <span className={styles.sheetIcon}>🍢</span>
              <h3 className={styles.sheetName}>{selectedMenu.name}</h3>
              <span className={styles.sheetPrice}>¥{selectedMenu.price.toLocaleString()}</span>
              <div className={styles.sheetRow}>
                <span className={styles.sheetLabel}>販売場所</span>
                <span className={styles.sheetValue}>{selectedMenu.shop}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
