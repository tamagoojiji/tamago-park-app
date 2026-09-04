import { createContext, useContext } from 'react';
import type { User } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLiffReady: boolean;
  loginWithLine: () => void;
  logout: () => void;
  updateProfile: (birthday: string, gender: string) => Promise<void>;
  updateNickname: (nickname: string | null) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
