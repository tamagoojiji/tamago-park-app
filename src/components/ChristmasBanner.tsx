import { Link } from 'react-router-dom';
import { isChristmasStarted } from '../data/christmas';
import styles from './ChristmasBanner.module.css';

export default function ChristmasBanner() {
  const title = isChristmasStarted()
    ? 'クリスマスイベント 開催中'
    : 'クリスマスイベント 11/13 開幕';
  return (
    <Link to="/?tab=events" className={styles.banner}>
      <span className={styles.tree} aria-hidden="true">🎄</span>
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        <span className={styles.sub}>ユニバーサル・ホリデー・ワンダーズ 11/13〜1/17 ・ 夜のショーは1/11まで</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">›</span>
    </Link>
  );
}
