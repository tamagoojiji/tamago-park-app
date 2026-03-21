import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EmbedPage.module.css';

export default function RestaurantGuidePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'back-to-main') navigate('/');
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);

  return (
    <div className={styles.embedPage}>
      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ‹ メインサイトにもどる
        </button>
        <span className={styles.pageTitle}>レストラン診断</span>
      </div>
      <iframe
        src="https://tamagoojiji.github.io/usj-restaurant-guide/"
        className={styles.embedFrame}
        title="レストラン診断"
      />
    </div>
  );
}
