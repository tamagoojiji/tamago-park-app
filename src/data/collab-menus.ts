// 期間限定コラボレストラン。来園日が start〜end の店だけ表示（メニューは持たない・2026-09-04 ユーザー指示）
export interface CollabRestaurant { name: string; start: string; end: string; note?: string }

export const COLLAB_RESTAURANTS: CollabRestaurant[] = [
  {
    name: 'サンジの海賊レストラン（ワンピース）',
    start: '2026-07-30',
    end: '2026-11-19',
    note: '要チケット（抽選販売）大人7,000円／子ども2,600円・約85分入替制・ロンバーズ・ランディング',
  },
  { name: 'ディスカバリー・レストラン（ワンピース）', start: '2026-07-30', end: '2026-11-19' },
  { name: 'ロストワールド・レストラン（葬送のフリーレン）', start: '2026-05-30', end: '2027-01-11' },
];

export const COLLAB_PREFIX = 'コラボ飯：';

export function activeCollabRestaurants(visitDate: string): CollabRestaurant[] {
  if (!visitDate) return [];
  return COLLAB_RESTAURANTS.filter((r) => visitDate >= r.start && visitDate <= r.end);
}

/** 保存用の値。例: "コラボ飯：サンジの海賊レストラン（ワンピース）" */
export function collabValue(r: CollabRestaurant): string {
  return `${COLLAB_PREFIX}${r.name}`;
}
