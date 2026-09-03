import { Link } from 'react-router-dom';
import styles from './HalloweenBanner.module.css';

export default function HalloweenBanner() {
  return (
    <Link to="/halloween" className={styles.banner}>
      <span className={styles.moon} aria-hidden="true">🌙</span>
      <span className={styles.body}>
        <span className={styles.title}>ハロウィーン・ホラー・ナイト 15周年 開催中</span>
        <span className={styles.sub}>9/11〜11/8 ・ ストリート・ゾンビ 18:00〜</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">›</span>
    </Link>
  );
}
