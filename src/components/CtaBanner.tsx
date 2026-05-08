import styles from './CtaBanner.module.css';

export default function CtaBanner() {
  return (
    <section className={styles.ctaSection}>
      {/* セクション見出し */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionDeco}>＼ CHECK ／</span>
        <br />
        <span className={styles.sectionTitle}>プランニング案内</span>
      </div>

      {/* Instagram誘導 */}
      <a
        href="https://www.instagram.com/tamago_usj_guide/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaCard}
      >
        <span className={styles.ctaIcon}>📸</span>
        <div className={styles.ctaText}>
          <span className={styles.ctaTitle}>プランニングはこちら</span>
          <span className={styles.ctaSub}>Instagramで詳しくご案内中</span>
        </div>
        <span className={styles.ctaArrow}>›</span>
      </a>

      {/* LINE誘導 */}
      <div className={styles.ctaCard}>
        <span className={styles.ctaIcon}>💬</span>
        <div className={styles.ctaText}>
          <span className={styles.ctaTitle}>プランニング依頼</span>
          <span className={styles.ctaSub}>LINEで「プランニング希望」と送ってください</span>
        </div>
        <span className={styles.ctaArrow}>›</span>
      </div>

      {/* オープンチャット誘導 */}
      <a
        href="https://line.me/ti/g2/4GMbHMaOESeHfxXHwgHZ7M1b1ktcqPa5zwORlQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.ctaCard}
      >
        <span className={styles.ctaIcon}>📣</span>
        <div className={styles.ctaText}>
          <span className={styles.ctaTitle}>友達に教える</span>
          <span className={styles.ctaSub}>LINEオープンチャットに招待</span>
        </div>
        <span className={styles.ctaArrow}>›</span>
      </a>
    </section>
  );
}
