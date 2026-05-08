import { useEffect, useState } from 'react';
import { fetchShops, setShopCoordinates, type Shop } from '../../api/restaurants';
import styles from './AdminShopCoordinates.module.css';

export default function AdminShopCoordinatesPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [openShopId, setOpenShopId] = useState<number | null>(null); // モーダル中の店舗
  const [candidate, setCandidate] = useState<{ x: number; y: number } | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('MENU_API_KEY') || '');
  const [filter, setFilter] = useState<'all' | 'unset' | 'set'>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShops().then(setShops);
  }, []);

  const saveApiKey = (val: string) => {
    setApiKey(val);
    localStorage.setItem('MENU_API_KEY', val);
  };

  const openShopModal = (shopId: number) => {
    if (!apiKey) {
      alert('まず上部にMENU_API_KEYを入力してください');
      return;
    }
    setOpenShopId(shopId);
    setCandidate(null);
  };

  const closeModal = () => {
    setOpenShopId(null);
    setCandidate(null);
  };

  const handleMapTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // 画像要素を基準に座標計算（コンテナのレターボックス影響を排除）
    const wrap = e.currentTarget;
    const img = wrap.querySelector('img') as HTMLImageElement | null;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else return;
    // 画像範囲外クリックは無視
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
    const x = Number((((clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = Number((((clientY - rect.top) / rect.height) * 100).toFixed(2));
    setCandidate({ x, y });
  };

  const confirmSave = async () => {
    if (!openShopId || !candidate) return;
    setSaving(true);
    try {
      await setShopCoordinates(openShopId, candidate.x, candidate.y, apiKey);
      const updated = await fetchShops();
      setShops(updated);
      // 次の未設定店舗を自動的に開く
      const idx = updated.findIndex(s => s.id === openShopId);
      const next = updated.slice(idx + 1).find(s => s.map_x == null) ?? updated.find(s => s.map_x == null);
      if (next) {
        setOpenShopId(next.id);
        setCandidate(null);
      } else {
        closeModal();
        alert('全店舗の座標入力が完了しました🎉');
      }
    } catch (err) {
      alert('保存失敗: ' + String(err));
    } finally {
      setSaving(false);
    }
  };

  const clearCoords = async (shopId: number) => {
    if (!apiKey) { alert('API KEY が必要'); return; }
    if (!confirm('座標をクリアしますか？')) return;
    await setShopCoordinates(shopId, null, null, apiKey);
    setShops(await fetchShops());
  };

  const areas = Array.from(new Set(shops.map(s => s.area))).sort();
  const filteredShops = shops.filter(s => {
    if (filter === 'unset' && s.map_x != null) return false;
    if (filter === 'set' && s.map_x == null) return false;
    if (areaFilter !== 'all' && s.area !== areaFilter) return false;
    return true;
  });

  const setCount = shops.filter(s => s.map_x != null).length;
  const openShop = shops.find(s => s.id === openShopId);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>食べ歩き座標設定</h1>

      <div className={styles.apiKeyBar}>
        <label>MENU_API_KEY:</label>
        <input
          type="password"
          value={apiKey}
          onChange={e => saveApiKey(e.target.value)}
          placeholder="API KEYを貼り付け"
          className={styles.apiKeyInput}
        />
        <span className={styles.progress}>進捗: {setCount} / {shops.length}</span>
      </div>

      <div className={styles.filterBar}>
        <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)}>
          <option value="all">全エリア</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={() => setFilter('all')} className={filter === 'all' ? styles.activeFilter : ''}>全部</button>
        <button onClick={() => setFilter('unset')} className={filter === 'unset' ? styles.activeFilter : ''}>未設定のみ</button>
        <button onClick={() => setFilter('set')} className={filter === 'set' ? styles.activeFilter : ''}>設定済のみ</button>
      </div>

      <div className={styles.shopGrid}>
        {filteredShops.map(s => (
          <button
            key={s.id}
            onClick={() => openShopModal(s.id)}
            className={`${styles.shopItem} ${s.map_x != null ? styles.hasCoords : ''}`}
          >
            <div className={styles.shopName}>
              {s.map_x != null ? '✓ ' : '○ '}{s.canonical_name}
            </div>
            <div className={styles.shopArea}>{s.area}</div>
            {s.map_x != null && (
              <span className={styles.clearBtn} onClick={(e) => { e.stopPropagation(); clearCoords(s.id); }}>×</span>
            )}
          </button>
        ))}
      </div>

      {/* フルスクリーン座標選択モーダル */}
      {openShop && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalHeader}>
            <button className={styles.modalCloseBtn} onClick={closeModal}>×</button>
            <div className={styles.modalShopInfo}>
              <div className={styles.modalShopName}>{openShop.canonical_name}</div>
              <div className={styles.modalShopArea}>{openShop.area}</div>
            </div>
            <div className={styles.modalProgress}>{setCount + (candidate ? 1 : 0)} / {shops.length}</div>
          </div>

          <div className={styles.modalMapWrap}>
            <div className={styles.modalMapInner} onClick={handleMapTap}>
              <img src="/images/park-map.jpg" alt="USJパークマップ" className={styles.modalMapImg} draggable={false} />
              {/* 既設店舗の小ピン（参考用） */}
              {shops.filter(s => s.map_x != null && s.id !== openShop.id).map(s => (
                <div
                  key={s.id}
                  className={styles.modalPinSmall}
                  style={{ left: `${s.map_x}%`, top: `${s.map_y}%` }}
                  title={s.canonical_name}
                />
              ))}
              {/* 既設のこの店舗の現座標（黄色） */}
              {openShop.map_x != null && !candidate && (
                <div
                  className={styles.modalPinExisting}
                  style={{ left: `${openShop.map_x}%`, top: `${openShop.map_y}%` }}
                />
              )}
              {/* 候補座標（赤・大） */}
              {candidate && (
                <div
                  className={styles.modalPinCandidate}
                  style={{ left: `${candidate.x}%`, top: `${candidate.y}%` }}
                />
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            {!candidate && !openShop.map_x && (
              <p className={styles.hint}>マップ上の販売場所をタップしてください</p>
            )}
            {!candidate && openShop.map_x != null && (
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
