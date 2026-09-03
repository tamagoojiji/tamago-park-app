import { useEffect, useState } from 'react';
import type { RestaurantInfo, MenuItem, Shop, TabearukiMenu, RestaurantLocation, RestaurantHoursDay } from '../api/restaurants';
import { fetchStoreMenus, fetchShops, fetchTabearukiMenus, fetchRestaurantLocations, fetchRestaurantHoursWeek } from '../api/restaurants';
import {
  RESTAURANT_GENRES,
  TABEARUKI_SUB_GENRES,
  FOOD_SUB_GENRES,
  UPCOMING_GENRE,
  RESTAURANT_GENRE_MAP,
  RESTAURANT_IMAGE_MAP,
  TABEARUKI_IMAGE_MAP,
  CLOSED_RESTAURANTS,
  RESTAURANT_HOURS_OVERRIDE,
  isTabearuki,
} from '../data/restaurant-genres';
import styles from './RestaurantList.module.css';

// 既存テンプレート互換のビュー型（DB由来 + shopマップで店舗名/エリア解決）
interface TabearukiItem {
  id: number;
  name: string;
  price: number | null;
  shop: string;
  area: string;
  genre: string;
  suspended?: boolean;
  comment?: string;
  saleStart?: string;
  saleEnd?: string;
  tags?: string[];
  shopIds: number[];
}

// ローカルタイムゾーン基準のYYYY-MM-DD（JSTズレ・日跨ぎ対応のため呼び出し時に都度算出）
const todayLocalIso = (): string => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};
const isUpcoming = (m: TabearukiItem): boolean => !!m.saleStart && m.saleStart > todayLocalIso();

const buildTabearukiView = (menus: TabearukiMenu[], shops: Shop[]): TabearukiItem[] => {
  const shopMap = new Map(shops.map((s) => [s.id, s]));
  return menus.map((m) => {
    const resolved = m.shop_ids.map((id) => shopMap.get(id)).filter((s): s is Shop => !!s);
    const shopNames = resolved.map((s) => s.canonical_name).join(' / ');
    const areas = [...new Set(resolved.map((s) => s.area))].join(' / ');
    return {
      id: m.id,
      name: m.menu_name,
      price: m.price,
      shop: shopNames,
      area: areas,
      genre: m.genre,
      suspended: m.suspended,
      comment: m.description ?? undefined,
      saleStart: m.sale_start ?? undefined,
      saleEnd: m.sale_end ?? undefined,
      tags: m.tags,
      shopIds: m.shop_ids,
    };
  });
};

const ALL_TABEARUKI_GENRES = [...TABEARUKI_SUB_GENRES, ...FOOD_SUB_GENRES, UPCOMING_GENRE];

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
  const [hoursWeek, setHoursWeek] = useState<RestaurantHoursDay[]>([]);
  const [tabearukiMenus, setTabearukiMenus] = useState<TabearukiItem[]>([]);
  const [shopsMap, setShopsMap] = useState<Map<number, Shop>>(new Map());
  const [isTabearukiLoading, setIsTabearukiLoading] = useState(true);
  const [restaurantLocations, setRestaurantLocations] = useState<Map<string, RestaurantLocation>>(new Map());
  const [isSavingCard, setIsSavingCard] = useState(false);

  useEffect(() => {
    fetchRestaurantLocations()
      .then(locs => setRestaurantLocations(new Map(locs.map(l => [l.restaurant_name, l]))))
      .catch(() => setRestaurantLocations(new Map()));
  }, []);

  // ボトムシート開いた瞬間に html-to-image を事前読込（初回タップの待ち時間を削減）
  useEffect(() => {
    if (selectedMenu) {
      import('html-to-image').catch(() => {});
    }
  }, [selectedMenu]);

  // 食べ歩きメニュー + shopsをAPIから独立して取得（片方失敗してもメニュー一覧は維持）
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([fetchShops(), fetchTabearukiMenus()])
      .then(([shopsRes, menusRes]) => {
        if (cancelled) return;
        const shops = shopsRes.status === 'fulfilled' ? shopsRes.value : [];
        const menus = menusRes.status === 'fulfilled' ? menusRes.value : [];
        setShopsMap(new Map(shops.map(s => [s.id, s])));
        setTabearukiMenus(buildTabearukiView(menus, shops));
      })
      .finally(() => {
        if (!cancelled) setIsTabearukiLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) {
      setStoreMenus(null);
      setHoursWeek([]);
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
    fetchRestaurantHoursWeek(selected.restaurant_name)
      .then((days) => {
        if (!cancelled) setHoursWeek(days);
      })
      .catch(() => {
        if (!cancelled) setHoursWeek([]);
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

  if (activeRestaurants.length === 0 && tabearukiMenus.length === 0 && !isTabearukiLoading) {
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

  // 食べ歩きフード メニュー用フィルタ（販売停止中は除外、saleStart未来のものは別タブへ）
  const getFilteredMenu = (): TabearukiItem[] => {
    if (!genreId) return [];
    if (genreId === UPCOMING_GENRE.id) {
      return tabearukiMenus.filter((m) => !m.suspended && isUpcoming(m));
    }
    return tabearukiMenus.filter(
      (m) => m.genre === genreId && !m.suspended && !isUpcoming(m)
    );
  };

  const genreLabel = () => {
    if (!category || !genreId) return '';
    if (category === 'restaurant') {
      return RESTAURANT_GENRES.find((g) => g.id === genreId)?.label || '';
    }
    return ALL_TABEARUKI_GENRES.find((g) => g.id === genreId)?.label || '';
  };

  const isLimited = (m: TabearukiItem): boolean => {
    if (!m.saleStart && !m.saleEnd) return false;
    return true;
  };

  const renderBadges = (m: TabearukiItem) => {
    const badges: { key: string; label: string; className: string }[] = [];
    if (isUpcoming(m) && m.saleStart) {
      badges.push({
        key: 'upcoming',
        label: `📅 ${formatDate(m.saleStart)}販売開始`,
        className: styles.badgeUpcoming,
      });
    }
    const seen = new Set<string>();
    (m.tags ?? []).forEach((raw, i) => {
      const tag = raw.trim();
      if (!tag || seen.has(tag)) return;
      seen.add(tag);
      if (tag === '25周年') {
        badges.push({ key: `anniv-${i}`, label: '🎉 25周年', className: styles.badgeAnniv });
      } else {
        badges.push({ key: `collab-${i}-${tag}`, label: `⭐ ${tag}`, className: styles.badgeCollab });
      }
    });
    if (isLimited(m) && !isUpcoming(m)) {
      badges.push({ key: 'limited', label: '⏳ 期間限定', className: styles.badgeLimited });
    }
    return badges.map((b) => (
      <span key={b.key} className={`${styles.badge} ${b.className}`}>{b.label}</span>
    ));
  };

  const formatDate = (s?: string): string => {
    if (!s) return '';
    const [y, mo, d] = s.split('-');
    return `${y}/${parseInt(mo, 10)}/${parseInt(d, 10)}`;
  };

  const formatMultiline = (s: string): string => s.split(' / ').join('\n');

  // カードを画像化して写真として保存（iOS=共有シートで「画像を保存」、それ以外=ダウンロード）
  const saveFoodMapCard = async (menuName: string) => {
    if (isSavingCard) return;
    setIsSavingCard(true);
    const card = document.querySelector('[data-savable="true"]') as HTMLElement | null;
    if (!card) { setIsSavingCard(false); return; }
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(card, { pixelRatio: 2, cacheBust: true, skipFonts: false });
      const fileName = `${menuName.replace(/[\\/:*?"<>|]/g, '_')}.png`;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });
      const navAny = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
      if (navigator.share && navAny.canShare && navAny.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: menuName });
          return;
        } catch {
          // 共有をキャンセルした場合は下のダウンロードにフォールバック
        }
      }
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('画像化に失敗しました: ' + String(err));
    } finally {
      setIsSavingCard(false);
    }
  };

  const formatPrice = (p: number | null): string => {
    if (p == null) return '価格未定';
    return `¥${p.toLocaleString()}`;
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
            ジャンルを選んでください
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
              {ALL_TABEARUKI_GENRES.map((g) => {
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
                          {r.open_time && r.close_time ? (
                            <span className={styles.resultTime}>
                              {r.open_time}〜{r.close_time}
                            </span>
                          ) : RESTAURANT_HOURS_OVERRIDE[r.restaurant_name] ? (
                            <span className={styles.resultTime}>
                              {RESTAURANT_HOURS_OVERRIDE[r.restaurant_name]}
                            </span>
                          ) : null}
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

          {/* 食べ歩き/フードメニュー結果 */}
          {category === 'tabearuki' && (() => {
            if (isTabearukiLoading) {
              return <p className={styles.placeholder}>メニューを読み込み中...</p>;
            }
            const menuList = getFilteredMenu();
            if (menuList.length === 0) {
              const emptyText = genreId === UPCOMING_GENRE.id
                ? '今後販売予定のメニューはありません'
                : 'メニュー情報は準備中です';
              return <p className={styles.placeholder}>{emptyText}</p>;
            }
            return (
              <>
                <p className={styles.resultCount}>{menuList.length}品</p>
                <div className={styles.resultList}>
                  {menuList.map((m) => (
                    <button
                      key={m.id}
                      className={styles.menuCard}
                      onClick={() => setSelectedMenu(m)}
                    >
                      <div className={styles.menuInfo}>
                        <span className={styles.menuName}>
                          {m.name}
                          {renderBadges(m)}
                        </span>
                        <span className={styles.menuPrice}>{formatPrice(m.price)}</span>
                        <span className={styles.menuShop}>📍 {formatMultiline(m.shop)}</span>
                        <span className={styles.menuArea}>🗺️ {formatMultiline(m.area)}</span>
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
              {hoursWeek.length > 0 ? (
                <div className={styles.sheetHoursWeek}>
                  <div className={styles.sheetLabel}>営業時間（7日間）</div>
                  <ul className={styles.sheetHoursList}>
                    {hoursWeek.map((d) => {
                      const dt = new Date(d.date);
                      const wd = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()];
                      const md = `${dt.getMonth() + 1}/${dt.getDate()}`;
                      const override = RESTAURANT_HOURS_OVERRIDE[selected.restaurant_name];
                      const text = d.open_time && d.close_time
                        ? `${d.open_time}〜${d.close_time}`
                        : override || '—';
                      return (
                        <li key={d.date} className={styles.sheetHoursItem}>
                          <span className={styles.sheetHoursDate}>{md}({wd})</span>
                          <span className={styles.sheetHoursValue}>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : RESTAURANT_HOURS_OVERRIDE[selected.restaurant_name] ? (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>営業時間</span>
                  <span className={styles.sheetValue}>
                    {RESTAURANT_HOURS_OVERRIDE[selected.restaurant_name]}
                  </span>
                </div>
              ) : null}

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

              {/* マップ＋マーカー（レストラン位置） */}
              {(() => {
                const loc = restaurantLocations.get(selected.restaurant_name);
                return (
                  <div className={styles.sheetMapSection}>
                    <div className={styles.sheetLabel}>📍 場所マップ</div>
                    {!loc || loc.map_x == null ? (
                      <p className={styles.sheetMenuPlaceholder}>場所が未設定です</p>
                    ) : (
                      <div className={styles.menuMapContainer}>
                        <div className={styles.mapBanner}>
                          <div className={styles.mapBannerName}>🍽 {selected.restaurant_name}</div>
                          {selected.dining_type && <div className={styles.mapBannerSub}>{selected.dining_type}</div>}
                        </div>
                        <img src="/images/park-map.jpg" alt="マップ" className={styles.menuMapImg} />
                        <div
                          className={styles.menuMapMarker}
                          style={{ left: `${loc.map_x}%`, top: `${loc.map_y}%` }}
                        >
                          <div className={styles.markerDot} />
                          <div className={styles.markerLabel}>{selected.restaurant_name}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ボトムシート（食べ歩き/フードメニュー） */}
      {selectedMenu && (
        <div className={styles.overlay} onClick={() => setSelectedMenu(null)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedMenu(null)}>
              ×
            </button>
            <div className={styles.sheetContent}>
              <span className={styles.sheetIcon}>🍢</span>
              <h3 className={styles.sheetName}>{selectedMenu.name}</h3>
              {(() => {
                const badges = renderBadges(selectedMenu);
                return badges.length > 0 ? <div className={styles.sheetBadges}>{badges}</div> : null;
              })()}
              <span className={styles.sheetPrice}>{formatPrice(selectedMenu.price)}</span>
              <div className={styles.sheetRow}>
                <span className={styles.sheetLabel}>販売場所</span>
                <span className={styles.sheetValue}>{formatMultiline(selectedMenu.shop)}</span>
              </div>
              <div className={styles.sheetRow}>
                <span className={styles.sheetLabel}>エリア</span>
                <span className={styles.sheetValue}>{formatMultiline(selectedMenu.area)}</span>
              </div>
              {(selectedMenu.saleStart || selectedMenu.saleEnd) && (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>販売期間</span>
                  <span className={styles.sheetValue}>
                    {formatDate(selectedMenu.saleStart)}〜{formatDate(selectedMenu.saleEnd)}
                  </span>
                </div>
              )}
              {selectedMenu.comment && (
                <div className={styles.sheetRow}>
                  <span className={styles.sheetLabel}>備考</span>
                  <span className={styles.sheetValue}>{selectedMenu.comment}</span>
                </div>
              )}

              {/* マップ＋マーカー（テンプレート: 青フレーム + 上左メニュー名 + 下右エリア） */}
              {(() => {
                const shopsForMenu = selectedMenu.shopIds
                  .map(id => shopsMap.get(id))
                  .filter((s): s is Shop => !!s && s.map_x != null && s.map_y != null);
                const areaText = selectedMenu.area || '';
                return (
                  <div className={styles.sheetMapSection}>
                    <div className={styles.sheetLabel}>📍 販売場所マップ</div>
                    {shopsForMenu.length === 0 ? (
                      <p className={styles.sheetMenuPlaceholder}>店舗座標が未設定です</p>
                    ) : (
                      <>
                        <div
                          className={styles.foodMapCard}
                          data-savable="true"
                        >
                          <div className={styles.foodMapTitle}>{selectedMenu.name}</div>
                          <div className={styles.foodMapImageWrap}>
                            <img src="/images/park-map.jpg" alt="マップ" className={styles.foodMapImg} crossOrigin="anonymous" />
                            {shopsForMenu.map((s, idx) => (
                              <div
                                key={s.id}
                                className={styles.menuMapMarker}
                                style={{ left: `${s.map_x}%`, top: `${s.map_y}%` }}
                              >
                                <div className={styles.markerNumber}>{idx + 1}</div>
                              </div>
                            ))}
                          </div>
                          <ol className={styles.shopLegend}>
                            {shopsForMenu.map((s) => (
                              <li key={s.id}>{s.canonical_name}</li>
                            ))}
                          </ol>
                          <div className={styles.foodMapArea}>{areaText.split(' / ').join('\n')}</div>
                        </div>
                        <button
                          type="button"
                          className={styles.saveButton}
                          onClick={() => saveFoodMapCard(selectedMenu.name)}
                          disabled={isSavingCard}
                        >
                          {isSavingCard ? '⏳ 保存中...' : '📥 写真として保存'}
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
