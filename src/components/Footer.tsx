import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.disclaimer}>
        本アプリはUSJの公式アプリではありません。
        <br />
        掲載情報は変更される場合があります。
      </p>
      <a href="/privacy" className={styles.link}>
        プライバシーポリシー
      </a>
      <p className={styles.copyright}>
        &copy; 2026 たまごのパーク攻略
      </p>
    </footer>
  );
}
