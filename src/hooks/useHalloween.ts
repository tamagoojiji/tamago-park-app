import { useEffect, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { isHalloweenPeriodNow, localDateString } from '../data/halloween';

const PREVIEW_KEY = 'tamago_hw';

// sessionStorageが無効な環境（プライベートモード等）でも画面を落とさない
function readPreview(): string | null {
  try {
    return sessionStorage.getItem(PREVIEW_KEY);
  } catch {
    return null;
  }
}

function writePreview(value: string) {
  try {
    sessionStorage.setItem(PREVIEW_KEY, value);
  } catch {
    /* 保存できなくてもURLパラメータの間は表示できるので無視 */
  }
}

// 端末ローカル日付の共有ストア。開きっぱなしのセッションでも日付が変われば再renderされ、
// 期間終了（11/9）の時点で通常表示へ戻る。タイマーは複数コンポーネントで1本だけ共有する。
const listeners = new Set<() => void>();
let currentDate = localDateString();
let timerId: ReturnType<typeof setInterval> | undefined;

function subscribeDate(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (timerId === undefined) {
    timerId = setInterval(() => {
      const next = localDateString();
      if (next === currentDate) return;
      currentDate = next;
      listeners.forEach((notify) => notify());
    }, 60000);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && timerId !== undefined) {
      clearInterval(timerId);
      timerId = undefined;
    }
  };
}

function getDateSnapshot() {
  return currentDate;
}

// ハロウィーン表示ON/OFF。期間中は自動ON。
// URLに ?hw=1 で強制ON、?hw=0 で強制OFF（どちらもsessionStorageに保存し、遷移後も維持）。
export function useHalloween(): boolean {
  const { search } = useLocation();
  const hw = new URLSearchParams(search).get('hw');

  // 日付が変わったら再renderさせるための購読（値自体は下の期間判定で使う）
  useSyncExternalStore(subscribeDate, getDateSnapshot, getDateSnapshot);

  // 保存はrender中ではなくeffectで行う（renderを純粋に保つ）
  useEffect(() => {
    if (hw === '1' || hw === '0') writePreview(hw);
  }, [hw]);

  // URLパラメータ優先。無ければ保存済みプレビュー、それも無ければ実際の期間で判定
  const preview = hw === '1' || hw === '0' ? hw : readPreview();
  if (preview === '1') return true;
  if (preview === '0') return false;
  return isHalloweenPeriodNow();
}
