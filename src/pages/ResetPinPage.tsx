import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import styles from './AuthPage.module.css';

export default function ResetPinPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authApi.resetPin(email);
      setSuccess(res.message || '新しいPINコードをメールで送信しました');
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>PIN再発行</h1>
        <p className={styles.subtitle}>登録メールアドレスに新しいPINを送信します</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

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

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? '送信中...' : 'PINコードを再発行'}
          </button>
        </form>

        <div className={styles.links}>
          <button className={styles.link} onClick={() => navigate('/login')}>
            ログインに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
