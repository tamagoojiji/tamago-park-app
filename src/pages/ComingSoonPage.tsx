import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ComingSoonPage.module.css';

export default function ComingSoonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const feature = (location.state as { feature?: string })?.feature || 'この機能';

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <span className={styles.icon}>🚧</span>
        <h2 className={styles.title}>{feature}</h2>
        <p className={styles.message}>現在準備中です</p>
        <p className={styles.sub}>もうしばらくお待ちください！</p>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ホームに戻る
        </button>
      </div>
    </main>
  );
}
