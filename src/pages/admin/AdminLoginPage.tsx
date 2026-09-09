import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, setAdminToken, hasAdminToken } from '../../api/admin';
import styles from './Admin.module.css';

const REDIRECT_KEY = 'tamago_park_admin_redirect';

// ログイン前に開こうとした管理ページがあればそこへ、無ければダッシュボードへ
function takeRedirect(): string {
  const dest = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return dest && dest.startsWith('/admin/') ? dest : '/admin/dashboard';
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const loggedIn = hasAdminToken();

  // 描画中の navigate は初回が捨てられるため useEffect で1回だけ遷移する
  useEffect(() => {
    if (loggedIn) navigate(takeRedirect(), { replace: true });
  }, [loggedIn, navigate]);

  if (loggedIn) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login(password);
      setAdminToken(res.token);
      navigate(takeRedirect(), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 className={styles.loginTitle}>管理者ログイン</h1>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          autoFocus
        />
        <button type="submit" className={styles.submitBtn} disabled={loading || !password}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
