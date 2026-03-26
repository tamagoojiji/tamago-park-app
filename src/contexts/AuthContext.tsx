import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import liff from '@line/liff';
import type { User } from '../types';
import { authApi } from '../api/auth';

const LIFF_ID = '2009615065-BrHFffo2';
const TOKEN_KEY = 'tamago_park_token';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLiffReady: boolean;
  loginWithLine: () => void;
  logout: () => void;
  skipLogin: () => void;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const saveToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsGuest(false);
    if (liff.isLoggedIn()) {
      liff.logout();
    }
  }, []);

  const skipLogin = useCallback(() => {
    setIsGuest(true);
    setIsLoading(false);
  }, []);

  // LIFF初期化
  useEffect(() => {
    liff.init({ liffId: LIFF_ID })
      .then(async () => {
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
        setIsLoading(false);
      })
      .catch(() => {
        setIsLiffReady(true);
        setIsLoading(false);
      });
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
      loginWithLine, logout, skipLogin, isGuest,
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
