import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideMenu from './SideMenu';
import { useHalloween } from '../hooks/useHalloween';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const halloween = useHalloween();
  const isHome = location.pathname === '/';

  const handleLogoClick = () => {
    if (!isHome) navigate('/');
  };

  return (
    <>
      <header className={styles.header}>
        {halloween && (
          <>
            <span className={styles.hwPumpkin} aria-hidden="true">🎃</span>
            <span className={styles.hwBats} aria-hidden="true">🦇🦇</span>
          </>
        )}
        <h1
          className={`${styles.title} ${isHome ? '' : styles.clickable}`}
          onClick={handleLogoClick}
        >
          <img
            src={`${import.meta.env.BASE_URL}images/header-logo.png`}
            alt="たまごのパーク攻略"
            className={styles.logo}
          />
        </h1>
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(true)}
          aria-label="メニューを開く"
        >
          <span className={styles.menuIcon} />
          <span className={styles.menuIcon} />
          <span className={styles.menuIcon} />
        </button>
      </header>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
