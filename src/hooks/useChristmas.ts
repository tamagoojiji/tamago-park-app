import { useEffect, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { isChristmasPeriodNow } from '../data/christmas';
import { subscribeDate, getDateSnapshot } from './localDateStore';

const PREVIEW_KEY = 'tamago_xmas';

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

// クリスマス表示ON/OFF。期間中は自動ON。
// URLに ?xmas=1 で強制ON、?xmas=0 で強制OFF（どちらもsessionStorageに保存し、遷移後も維持）。
export function useChristmas(): boolean {
  const { search } = useLocation();
  const xmas = new URLSearchParams(search).get('xmas');

  // 日付が変わったら再renderさせるための購読（値自体は下の期間判定で使う）
  useSyncExternalStore(subscribeDate, getDateSnapshot, getDateSnapshot);

  // 保存はrender中ではなくeffectで行う（renderを純粋に保つ）
  useEffect(() => {
    if (xmas === '1' || xmas === '0') writePreview(xmas);
  }, [xmas]);

  // URLパラメータ優先。無ければ保存済みプレビュー、それも無ければ実際の期間で判定
  const preview = xmas === '1' || xmas === '0' ? xmas : readPreview();
  if (preview === '1') return true;
  if (preview === '0') return false;
  return isChristmasPeriodNow();
}
