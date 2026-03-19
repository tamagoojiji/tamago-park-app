import { useNavigate } from 'react-router-dom';
import styles from './GuidePage.module.css';

export default function GuidePage() {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <h2 className={styles.title}>プランニング案内</h2>

      <a
        href="https://www.instagram.com/tamago_usj_guide/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
      >
        <span className={styles.cardIcon}>📸</span>
        <div>
          <p className={styles.cardTitle}>Instagramで詳しくご案内中</p>
          <p className={styles.cardSub}>@tamago_usj_guide</p>
        </div>
      </a>

      <div className={styles.card}>
        <span className={styles.cardIcon}>💬</span>
        <div>
          <p className={styles.cardTitle}>LINEでプランニング依頼</p>
          <p className={styles.cardSub}>「プランニング希望」と送ってください</p>
        </div>
      </div>

      <button className={styles.backButton} onClick={() => navigate('/')}>
        ← ホームに戻る
      </button>
    </main>
  );
}
