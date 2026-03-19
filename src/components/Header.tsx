import { useState } from 'react';
import SideMenu from './SideMenu';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
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
