import { useNavigate } from 'react-router-dom';
import type { MenuItem } from '../types';
import styles from './SideMenu.module.css';

const menuItems: MenuItem[] = [
  { id: 'home', label: 'ホーム', path: '/', icon: '🏠' },
  { id: 'survey', label: 'プランニング依頼者専用', path: '/survey', icon: '📝' },
  { id: 'myplan', label: 'マイプラン作成', path: '/myplan', icon: '📋' },
  { id: 'myplan-history', label: 'マイプラン履歴', path: '/myplan/history', icon: '📂' },
  { id: 'ep', label: 'エクスプレス・パス診断', path: '/ep', icon: '🎢' },
  { id: 'restaurant', label: 'レストラン診断', path: '/restaurant', icon: '🍽️' },
  { id: 'ai', label: 'たまごの相談部屋', path: '/ai', icon: '💬', comingSoon: true },
  { id: 'checklist', label: 'チェックリスト', path: '/checklist', icon: '✅' },
  { id: 'height', label: '身長制限リスト', path: '/height', icon: '📏' },
  { id: 'tickets', label: 'チケット値段一覧', path: '/tickets', icon: '🎟️', comingSoon: true },
  { id: 'guide', label: 'プランニング案内', path: '/guide', icon: '📸' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  const handleItemClick = (item: MenuItem) => {
    if (item.comingSoon) {
      navigate('/coming-soon', { state: { feature: item.label } });
    } else {
      navigate(item.path);
    }
    onClose();
  };

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <nav className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>メニュー</span>
          <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ✕
          </button>
        </div>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              <button
                className={styles.menuLink}
                onClick={() => handleItemClick(item)}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
                {item.comingSoon && (
                  <span className={styles.comingSoonBadge}>準備中</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
