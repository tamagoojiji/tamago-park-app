import { localDateString } from '../data/halloween';

// 端末ローカル日付の共有ストア。開きっぱなしのセッションでも日付が変われば再renderされ、
// 期間終了の時点で通常表示へ戻る。タイマーは複数コンポーネントで1本だけ共有する。
const listeners = new Set<() => void>();
let currentDate = localDateString();
let timerId: ReturnType<typeof setInterval> | undefined;

export function subscribeDate(onStoreChange: () => void) {
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

export function getDateSnapshot() {
  return currentDate;
}
