import styles from './CtaBanner.module.css';

export default function CtaBanner() {
  return (
    <section className={styles.ctaSection}>
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
    </section>
  );
}
