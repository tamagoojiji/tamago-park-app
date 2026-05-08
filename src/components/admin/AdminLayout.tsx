import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAdminToken } from '../../api/admin';
import styles from './AdminLayout.module.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'ダッシュボード' },
  { to: '/admin/users', label: 'ユーザー' },
  { to: '/admin/surveys', label: 'アンケート' },
  { to: '/admin/shows', label: 'ショー' },
  { to: '/admin/events', label: 'イベント' },
  { to: '/admin/stats', label: '統計' },
  { to: '/admin/shop-coordinates', label: '食べ歩き座標' },
  { to: '/admin/restaurant-coordinates', label: 'レストラン座標' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin');
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>管理メニュー</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>ログアウト</button>
      </header>
      <div className={styles.body}>
        <nav className={styles.sidebar}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
