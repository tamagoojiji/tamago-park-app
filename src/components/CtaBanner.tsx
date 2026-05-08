import { useState } from 'react';
import styles from './CtaBanner.module.css';

const OPEN_CHAT_URL =
  'https://line.me/ti/g2/4GMbHMaOESeHfxXHwgHZ7M1b1ktcqPa5zwORlQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default';

export default function CtaBanner() {
  const [copied, setCopied] = useState(false);

  const handleShareTap = async () => {
    try {
      await navigator.clipboard.writeText(OPEN_CHAT_URL);
    } catch {
      const el = document.createElement('textarea');
      el.value = OPEN_CHAT_URL;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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

      {/* オープンチャット誘導（タップでURLコピー） */}
      <button
        type="button"
        onClick={handleShareTap}
        className={`${styles.ctaCard} ${styles.ctaCardButton}`}
      >
        <span className={styles.ctaIcon}>📣</span>
        <div className={styles.ctaText}>
          <span className={styles.ctaTitle}>友達に教える</span>
          <span className={styles.ctaSub}>
            {copied ? 'URLをコピーしました' : 'タップでオープンチャットURLをコピー'}
          </span>
        </div>
        <span className={styles.ctaArrow}>{copied ? '✓' : '›'}</span>
      </button>
    </section>
  );
}
