import { useState, useEffect, useRef } from 'react';
import type { ShowData } from '../../../api/shows';
import { fetchShows } from '../../../api/shows';
import styles from './components.module.css';

interface Props {
  date: string;
  selected: string[];
  onChange: (names: string[]) => void;
}

const SHOW_IMAGES: Record<string, string> = {
  'NO LIMIT! パレード': '/images/shows/NO LIMIT!パレード.jpg',
  'アルティメット・ブルース・バッシュ': '/images/shows/アルティメット・ブルース・バッシュ〜音楽の色〜.jpg',
  'ウィキッド': '/images/shows/ウィキッド〜オズの魔女たち〜.jpg',
  'ウォーターワールド': '/images/shows/ウォーターワールド.jpg',
  'おさるのジョージ': '/images/shows/おさるのジョージ.jpg',
  'オリバンダー': '/images/shows/オリバンダーの店.jpg',
  'キティ': '/images/shows/キティのリボンコレクション.jpg',
  'ジュラシック・ワールド・ディノ・エンカウンター': '/images/shows/ジュラシック・ワールド ディノ・エンカウンター.jpg',
  'ジュラシック・ワールド・ベイビー・ディノ': '/images/shows/ジュラシック・ワールド ベイビー・ティノ・アドベンチャー.jpg',
  'ジュラシック・ワールド・ラプター・アラート': '/images/shows/ジュラシック・ワールド ラプター・アラート.jpg',
  'シング・オン・ツアー': '/images/shows/シング・オン・ツアー.jpg',
  'パワー・オブ・ロック': '/images/shows/パワーオブロック〜ユー・ロック〜.jpg',
  'モッピーのラッキー・ダンス・パーティ': '/images/shows/モッピーのラッキー・ダンス・パーティ.jpg',
  'ユニバーサル・モンスター・ライブ・ロックンロール・ショー': '/images/shows/ユニバーサル・モンスター・ライブ・ロックンロール・ショー.jpg',
  'ユニバーサル・ワンダーランド': '/images/shows/ユニバーサル・ワンダーランド〜レッツ・スマイル・トゥギャザー〜(セサミストリート).jpg',
  '名探偵コナン': '/images/shows/名探偵コナン４Dライブショー.png',
};

function getShowImage(name: string): string | undefined {
  if (SHOW_IMAGES[name]) return SHOW_IMAGES[name];
  for (const [key, path] of Object.entries(SHOW_IMAGES)) {
    if (name.includes(key) || key.includes(name)) return path;
  }
  return undefined;
}

export default function StepShowSelect({ date, selected, onChange }: Props) {
  const [shows, setShows] = useState<ShowData[] | null>(null);
  const fetchedRef = useRef('');

  useEffect(() => {
    if (!date || date === fetchedRef.current) return;
    fetchedRef.current = date;
    let cancelled = false;
    fetchShows(date)
      .then((result) => { if (!cancelled) setShows(result.shows); })
      .catch(() => { if (!cancelled) setShows([]); });
    return () => { cancelled = true; };
  }, [date]);

  const loading = shows === null;

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  if (loading) {
    return (
      <div className={styles.stepSection}>
        <h2 className={styles.stepTitle}>ショーを選択</h2>
        <p className={styles.loadingText}>ショー情報を取得中...</p>
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <div className={styles.stepSection}>
        <h2 className={styles.stepTitle}>ショーを選択</h2>
        <p className={styles.stepDescription}>この日のショー情報がまだありません。スキップして次へ進めます。</p>
      </div>
    );
  }

  return (
    <div className={styles.stepSection}>
      <h2 className={styles.stepTitle}>ショーを選択</h2>
      <p className={styles.stepDescription}>見たいショーをチェック（{selected.length}件選択中）</p>

      {shows!.map((show) => {
        const image = getShowImage(show.name);
        return (
        <label key={show.name} className={styles.checkItem}>
          <input
            type="checkbox"
            checked={selected.includes(show.name)}
            onChange={() => toggle(show.name)}
          />
          <span className={styles.checkItemImage}>
            {image ? (
              <img src={image} alt="" width={40} height={40} />
            ) : (
              <span className={styles.checkItemPlaceholder}>🎭</span>
            )}
          </span>
          <span className={styles.checkItemLabel}>
            {show.name}
            <span className={styles.showTimesHint}>{show.times.length}回公演</span>
          </span>
        </label>
        );
      })}
    </div>
  );
}
