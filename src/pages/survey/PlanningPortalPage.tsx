import { useNavigate } from 'react-router-dom';
import styles from './PlanningPortalPage.module.css';

const menuItems = [
  {
    id: 'survey',
    label: 'プランニングアンケート',
    desc: 'プランニングに必要な情報を入力',
    icon: '📝',
    path: '/survey/form',
  },
  {
    id: 'blog',
    label: '依頼者専用ブログ記事',
    desc: 'プランニング依頼者だけが読める記事',
    icon: '📖',
    href: 'https://usjenjoyguidenote.online/',
  },
];

export default function PlanningPortalPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>プランニング依頼者専用</h1>
        <p className={styles.subtitle}>ご依頼ありがとうございます</p>

        <div className={styles.menuList}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={styles.menuCard}
              onClick={() => {
                if ('href' in item && item.href) {
                  window.open(item.href, '_blank', 'noopener');
                } else if ('path' in item && item.path) {
                  navigate(item.path);
                }
              }}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <div className={styles.menuTextWrap}>
                <p className={styles.menuLabel}>{item.label}</p>
                <p className={styles.menuDesc}>{item.desc}</p>
              </div>
              <span className={styles.menuArrow}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
