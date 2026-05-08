import { useEffect, useState } from 'react';
import { fetchRestaurants, fetchRestaurantLocations, setRestaurantCoordinates, type RestaurantInfo, type RestaurantLocation } from '../../api/restaurants';
import { CLOSED_RESTAURANTS } from '../../data/restaurant-genres';
import styles from './AdminShopCoordinates.module.css';

const today = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

interface Item {
  name: string;
  map_x: number | null;
  map_y: number | null;
  inUsjList: boolean;
}

export default function AdminRestaurantCoordinatesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [openName, setOpenName] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<{ x: number; y: number } | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('MENU_API_KEY') || '');
  const [filter, setFilter] = useState<'all' | 'unset' | 'set'>('all');
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    const [restaurantsRes, locationsRes] = await Promise.all([
      fetchRestaurants(today()).catch(() => ({ restaurants: [] as RestaurantInfo[], date: '', count: 0 })),
      fetchRestaurantLocations().catch(() => [] as RestaurantLocation[]),
    ]);
    // クローズ店舗は除外
    const activeRestaurants = restaurantsRes.restaurants.filter(r => !CLOSED_RESTAURANTS.has(r.restaurant_name));
    const usjNames = new Set(activeRestaurants.map(r => r.restaurant_name));
    const locByName = new Map(locationsRes.map(l => [l.restaurant_name, l]));
    const all: Item[] = [];
    activeRestaurants.forEach(r => {
      const loc = locByName.get(r.restaurant_name);
      all.push({
        name: r.restaurant_name,
        map_x: loc?.map_x ?? null,
        map_y: loc?.map_y ?? null,
        inUsjList: true,
      });
    });
    // USJ APIに無く座標だけDBに残ってるもの（クローズ店舗の座標が残ってたら除外）
    locationsRes.forEach(l => {
      if (!usjNames.has(l.restaurant_name) && !CLOSED_RESTAURANTS.has(l.restaurant_name)) {
        all.push({ name: l.restaurant_name, map_x: l.map_x, map_y: l.map_y, inUsjList: false });
      }
    });
    all.sort((a, b) => a.name.localeCompare(b.name));
    setItems(all);
  };

  useEffect(() => { reload(); }, []);

  const saveApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('MENU_API_KEY', val);
  };

  const openModal = (name: string) => {
    if (!apiKey) { alert('まず上部にMENU_API_KEYを入力してください'); return; }
    setOpenName(name);
    setCandidate(null);
  };

  const closeModal = () => { setOpenName(null); setCandidate(null); };

  const handleMapTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const wrap = e.currentTarget;
    const img = wrap.querySelector('img') as HTMLImageElement | null;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e && e.touches.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
    else if ('clientX' in e) { clientX = e.clientX; clientY = e.clientY; }
    else return;
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
    const x = Number((((clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = Number((((clientY - rect.top) / rect.height) * 100).toFixed(2));
    setCandidate({ x, y });
  };

  const confirmSave = async () => {
    if (!openName || !candidate) return;
    setSaving(true);
    try {
      await setRestaurantCoordinates(openName, candidate.x, candidate.y, apiKey);
      await reload();
      const updatedItems = await (async () => {
        const [r, l] = await Promise.all([
          fetchRestaurants(today()).catch(() => ({ restaurants: [] as RestaurantInfo[], date: '', count: 0 })),
          fetchRestaurantLocations().catch(() => [] as RestaurantLocation[]),
        ]);
        const locByName = new Map(l.map(x => [x.restaurant_name, x]));
        return r.restaurants
          .filter(rr => !CLOSED_RESTAURANTS.has(rr.restaurant_name))
          .map(rr => ({ name: rr.restaurant_name, map_x: locByName.get(rr.restaurant_name)?.map_x ?? null }));
      })();
      const idx = updatedItems.findIndex(i => i.name === openName);
      const next = updatedItems.slice(idx + 1).find(i => i.map_x == null) ?? updatedItems.find(i => i.map_x == null);
      if (next) { setOpenName(next.name); setCandidate(null); }
      else { closeModal(); alert('全レストランの座標入力が完了しました🎉'); }
    } catch (err) {
      alert('保存失敗: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const clearCoords = async (name: string) => {
    if (!apiKey) { alert('API KEY が必要'); return; }
    if (!confirm('座標をクリアしますか？')) return;
    await setRestaurantCoordinates(name, null, null, apiKey);
    await reload();
  };

  const filteredItems = items.filter(i => {
    if (filter === 'unset' && i.map_x != null) return false;
    if (filter === 'set' && i.map_x == null) return false;
    return true;
  });

  const setCount = items.filter(i => i.map_x != null).length;
  const openItem = items.find(i => i.name === openName);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>レストラン座標設定</h1>

      <div className={styles.apiKeyBar}>
        <label>MENU_API_KEY:</label>
        <input
          type="password"
          value={apiKey}
          onChange={e => saveApiKey(e.target.value)}
          placeholder="API KEYを貼り付け"
          className={styles.apiKeyInput}
        />
        <span className={styles.progress}>進捗: {setCount} / {items.length}</span>
      </div>

      <div className={styles.filterBar}>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? styles.activeFilter : ''}>全部</button>
        <button onClick={() => setFilter('unset')} className={filter === 'unset' ? styles.activeFilter : ''}>未設定のみ</button>
        <button onClick={() => setFilter('set')} className={filter === 'set' ? styles.activeFilter : ''}>設定済のみ</button>
      </div>

      <div className={styles.shopGrid}>
        {filteredItems.map(i => (
          <button
            key={i.name}
            onClick={() => openModal(i.name)}
            className={`${styles.shopItem} ${i.map_x != null ? styles.hasCoords : ''}`}
          >
            <div className={styles.shopName}>
              {i.map_x != null ? '✓ ' : '○ '}{i.name}
            </div>
            <div className={styles.shopArea}>{i.inUsjList ? 'USJ営業中' : '⚠️USJ非掲載（手動登録のみ）'}</div>
            {i.map_x != null && (
              <span className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); clearCoords(i.name); }}>×</span>
            )}
          </button>
        ))}
      </div>

      {openItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalHeader}>
            <button className={styles.modalCloseBtn} onClick={closeModal}>×</button>
            <div className={styles.modalShopInfo}>
              <div className={styles.modalShopName}>{openItem.name}</div>
              <div className={styles.modalShopArea}>{openItem.inUsjList ? 'USJ営業中' : 'USJ非掲載'}</div>
            </div>
            <div className={styles.modalProgress}>{setCount + (candidate ? 1 : 0)} / {items.length}</div>
          </div>

          <div className={styles.modalMapWrap}>
            <div className={styles.modalMapInner} onClick={handleMapTap}>
              <img src="/images/park-map.jpg" alt="USJパークマップ" className={styles.modalMapImg} draggable={false} />
              {items.filter(i => i.map_x != null && i.name !== openItem.name).map(i => (
                <div
                  key={i.name}
                  className={styles.modalPinSmall}
                  style={{ left: `${i.map_x}%`, top: `${i.map_y}%` }}
                  title={i.name}
                />
              ))}
              {openItem.map_x != null && !candidate && (
                <div
                  className={styles.modalPinExisting}
                  style={{ left: `${openItem.map_x}%`, top: `${openItem.map_y}%` }}
                />
              )}
              {candidate && (
                <div
                  className={styles.modalPinCandidate}
                  style={{ left: `${candidate.x}%`, top: `${candidate.y}%` }}
                />
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            {!candidate && openItem.map_x == null && (
              <p className={styles.hint}>マップ上のレストラン位置をタップしてください</p>
            )}
            {!candidate && openItem.map_x != null && (
              <p className={styles.hint}>現在の位置: 黄ピン / 変更したい場合はマップをタップ</p>
            )}
            {candidate && (
              <>
                <p className={styles.confirmText}>
                  ここでいいですか？<br />
                  <span className={styles.coordsText}>x={candidate.x}, y={candidate.y}</span>
                </p>
                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setCandidate(null)} disabled={saving}>違う場所</button>
                  <button className={styles.confirmBtn} onClick={confirmSave} disabled={saving}>
                    {saving ? '保存中...' : 'OK・登録'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
