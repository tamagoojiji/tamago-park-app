import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './PlanningPortalPage.module.css';

const AUTH_BASE = import.meta.env.VITE_AUTH_API_URL || 'https://api.tamago-ai-world.com';
const FRIEND_KEY = 'tamago_planning_friend';

const menuItems = [
  {
    id: 'survey',
    label: 'プランニングアンケート',
    desc: 'プランニングに必要な情報を入力\n変更などについてはLINEに送ってください',
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
  const { token } = useAuth();
  const [isFriend, setIsFriend] = useState(() => sessionStorage.getItem(FRIEND_KEY) === 'ok');
  const [checking, setChecking] = useState(!isFriend);

  useEffect(() => {
    if (isFriend || !token) {
      setChecking(false);
      return;
    }
    fetch(`${AUTH_BASE}/auth/planning-friend`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.is_friend) {
          sessionStorage.setItem(FRIEND_KEY, 'ok');
          setIsFriend(true);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [token, isFriend]);

  if (checking) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>プランニング依頼者専用</h1>
          <p className={styles.subtitle}>確認中...</p>
        </div>
      </div>
    );
  }

  if (!isFriend) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>プランニング依頼者専用</h1>
          <p className={styles.subtitle}>このページはプランニング依頼者専用です</p>
          <p className={styles.lockedDesc}>プランニングをご依頼いただいた方のみアクセスできます。</p>
        </div>
      </div>
    );
  }

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
