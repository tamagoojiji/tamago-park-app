// 期間限定コラボ飯（店舗別）。来園日が start〜end の項目だけ表示。
// 対象はコラボレストラン2店のみ（2026-09-04 ユーザー指示）:
//   サンジの海賊レストラン … 公式発表(2026-04-24)。要チケット（抽選販売）
//   ロストワールド・レストラン（葬送のフリーレン） … park-api /menus 実データ（価格は取得時点）
export interface CollabStore { key: string; title: string; note?: string }
export interface CollabMenu { store: string; menu: string; start: string; end: string; price?: string }

export const COLLAB_STORES: CollabStore[] = [
  {
    key: 'sanji',
    title: 'サンジの海賊レストラン（ワンピース）',
    note: '要チケット（抽選販売）大人7,000円／子ども2,600円・約85分入替制・ロンバーズ・ランディング',
  },
  { key: 'frieren', title: 'ロストワールド・レストラン（葬送のフリーレン）' },
];

export const COLLAB_MENUS: CollabMenu[] = [
  // ワンピース・プレミア・サマー 2026: 7/30〜11/19、ロンバーズ・ランディング、約85分入替制
  { store: 'sanji', menu: 'レディたちに捧げるボアット・ア・ビジュー ～愛の宝石箱～（肉）', start: '2026-07-30', end: '2026-11-19' },
  { store: 'sanji', menu: 'レディたちに捧げるボアット・ア・ビジュー ～愛の宝石箱～（魚）', start: '2026-07-30', end: '2026-11-19' },
  { store: 'sanji', menu: 'レディにささげるメロリンラブ・スウィーツ', start: '2026-07-30', end: '2026-11-19' },
  // 葬送のフリーレン ～追憶のレストラン～: 5/30〜2027/1/11
  { store: 'frieren', menu: 'フリーレンのビーフプレート 〜赤ワイン香るデミグラスソース〜', start: '2026-05-30', end: '2027-01-11', price: '3,500円' },
  { store: 'frieren', menu: 'ヒンメルのオムレツプレート', start: '2026-05-30', end: '2027-01-11', price: '2,800円' },
  { store: 'frieren', menu: 'アイゼン＆ハイターのハンバーグとフィッシュ＆チップスプレート', start: '2026-05-30', end: '2027-01-11', price: '2,800円' },
  { store: 'frieren', menu: '旅の思い出セット フリーレンプレート（限定コースター付）', start: '2026-05-30', end: '2027-01-11', price: '4,550円' },
  { store: 'frieren', menu: '旅の思い出セット ヒンメルプレート（限定コースター付）', start: '2026-05-30', end: '2027-01-11', price: '3,850円' },
  { store: 'frieren', menu: '旅の思い出セット アイゼン＆ハイタープレート（限定コースター付）', start: '2026-05-30', end: '2027-01-11', price: '3,850円' },
  { store: 'frieren', menu: '"ビーフ倍盛" フリーレンのビーフプレート 〜赤ワイン香るデミグラスソース〜', start: '2026-05-30', end: '2027-01-11', price: '5,500円' },
  { store: 'frieren', menu: 'たのしい旅の宝箱 キッズセット', start: '2026-05-30', end: '2027-01-11', price: '1,400円' },
  { store: 'frieren', menu: 'フェルンのチェリー＆ブルーベリーパフェ', start: '2026-05-30', end: '2027-01-11', price: '1,200円〜' },
  { store: 'frieren', menu: 'シュタルクのショコラ＆ラズベリーケーキ', start: '2026-05-30', end: '2027-01-11', price: '1,000円' },
  { store: 'frieren', menu: '花香る フリーレンのホワイトソーダ', start: '2026-05-30', end: '2027-01-11', price: '800円〜' },
];

export const COLLAB_PREFIX = 'コラボ飯：';

export function activeCollabMenus(visitDate: string): CollabMenu[] {
  if (!visitDate) return [];
  return COLLAB_MENUS.filter((m) => visitDate >= m.start && visitDate <= m.end);
}

/** 来園日に1件以上メニューがある店舗だけを返す */
export function activeCollabStores(visitDate: string): CollabStore[] {
  const menus = activeCollabMenus(visitDate);
  return COLLAB_STORES.filter((s) => menus.some((m) => m.store === s.key));
}

/** 保存用の値。例: "コラボ飯：ヒンメルのオムレツプレート（ロストワールド・レストラン（葬送のフリーレン））" */
export function collabValue(m: CollabMenu): string {
  const title = COLLAB_STORES.find((s) => s.key === m.store)?.title ?? m.store;
  return `${COLLAB_PREFIX}${m.menu}（${title}）`;
}
