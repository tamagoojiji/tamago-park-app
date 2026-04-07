import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../api/config';
import styles from './PlanningPortalPage.module.css';

const PW_KEY = 'tamago_survey_pw';
const SURVEY_PW = 'tamago1216';

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
  const { token } = useAuth();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(PW_KEY) === 'ok');
  const [checking, setChecking] = useState(!unlocked);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');

  // 友だち判定で自動解除
  useEffect(() => {
    if (unlocked || !token) {
      setChecking(false);
      return;
    }
    apiFetch<{ is_friend: boolean }>('/auth/planning-friend', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.is_friend) {
          sessionStorage.setItem(PW_KEY, 'ok');
          setUnlocked(true);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [token, unlocked]);

  const handleUnlock = () => {
    if (pwInput === SURVEY_PW) {
      sessionStorage.setItem(PW_KEY, 'ok');
      setUnlocked(true);
    } else {
      setPwError('パスワードが違います');
    }
  };

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

  if (!unlocked) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>プランニング依頼者専用</h1>
          <p className={styles.subtitle}>パスワードを入力してください</p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            placeholder="パスワード"
            className={styles.pwInput}
            onKeyDown={(e) => { if (e.key === 'Enter') handleUnlock(); }}
          />
          {pwError && <div className={styles.error}>{pwError}</div>}
          <button className={styles.unlockButton} onClick={handleUnlock}>
            開く
          </button>
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
