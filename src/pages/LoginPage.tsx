import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, pin);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.subtitle}>メールアドレスと4桁PINでログイン</p>

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
            <label>PINコード（4桁）</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              required
              className={styles.pinInput}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading || pin.length !== 4}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className={styles.links}>
          <button className={styles.link} onClick={() => navigate('/register')}>
            アカウントを作成する
          </button>
          <button className={styles.link} onClick={() => navigate('/reset-pin')}>
            PINコードを忘れた方
          </button>
        </div>
      </div>
    </div>
  );
}
