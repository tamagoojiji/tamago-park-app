import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import liff from '@line/liff';
import type { User } from '../types';
import { authApi } from '../api/auth';

const LIFF_ID = '2009683881-HQ5uHile';
const TOKEN_KEY = 'tamago_park_token';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLiffReady: boolean;
  loginWithLine: () => void;
  logout: () => void;
  updateProfile: (birthday: string, gender: string) => Promise<void>;
  updateNickname: (nickname: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [isLiffReady, setIsLiffReady] = useState(false);
  const saveToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    try {
      if (liff.isLoggedIn()) {
        liff.logout();
      }
    } catch {
      // LIFF未初期化時は無視
    }
  }, []);

  // LIFF初期化（3秒タイムアウト付き）
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        setIsLoading(false);
      }
    };

    // タイムアウト: 3秒で強制完了
    const timer = setTimeout(() => {
      setIsLiffReady(true);
      finish();
    }, 3000);

    liff.init({ liffId: LIFF_ID })
      .then(async () => {
        clearTimeout(timer);
        setIsLiffReady(true);

        // LIFFログイン済みかつトークンがない場合、自動認証
        if (liff.isLoggedIn() && !token) {
          try {
            const accessToken = liff.getAccessToken();
            if (accessToken) {
              const res = await authApi.lineLogin(accessToken);
              if (res.token) {
                saveToken(res.token);
              }
            }
          } catch {
            // LIFFログイン済みだがAPI認証失敗 → ゲストとして続行
          }
        }
        finish();
      })
      .catch(() => {
        clearTimeout(timer);
        setIsLiffReady(true);
        finish();
      });

    return () => clearTimeout(timer);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // トークンがあればユーザー情報取得
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    authApi.getMe(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      });
  }, [token]);

  const updateProfile = useCallback(async (birthday: string, gender: string) => {
    if (!token) throw new Error('Not authenticated');
    const res = await authApi.updateProfile(token, birthday, gender);
    if (res.token) saveToken(res.token);
    // ユーザー情報を再取得
    const updated = await authApi.getMe(res.token || token);
    setUser(updated);
  }, [token]);

  const updateNickname = useCallback(async (nickname: string | null) => {
    if (!token) throw new Error('Not authenticated');
    await authApi.updateNickname(token, nickname);
    const updated = await authApi.getMe(token);
    setUser(updated);
  }, [token]);

  const loginWithLine = useCallback(() => {
    if (!isLiffReady) return;

    if (liff.isLoggedIn()) {
      // 既にLIFFログイン済み → APIにトークン送信
      const accessToken = liff.getAccessToken();
      if (accessToken) {
        setIsLoading(true);
        authApi.lineLogin(accessToken)
          .then((res) => {
            if (res.token) saveToken(res.token);
          })
          .catch(() => {})
          .finally(() => setIsLoading(false));
      }
    } else {
      // LIFFログインへリダイレクト
      liff.login();
    }
  }, [isLiffReady]);

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, isLiffReady,
      loginWithLine, logout, updateProfile, updateNickname,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
