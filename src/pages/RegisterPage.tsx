import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin !== pinConfirm) {
      setError('PINコードが一致しません');
      return;
    }

    setLoading(true);
    try {
      await register(email, pin);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>アカウント作成</h1>
        <p className={styles.subtitle}>メールアドレスと4桁PINで簡単登録</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label>PINコード（4桁の数字）</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              required
              className={styles.pinInput}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label>PINコード（確認）</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              required
              className={styles.pinInput}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading || pin.length !== 4 || pinConfirm.length !== 4}>
            {loading ? '登録中...' : 'アカウントを作成'}
          </button>
        </form>

        <div className={styles.links}>
          <button className={styles.link} onClick={() => navigate('/login')}>
            すでにアカウントをお持ちの方
          </button>
        </div>
      </div>
    </div>
  );
}
