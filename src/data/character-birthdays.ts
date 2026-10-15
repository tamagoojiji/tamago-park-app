import type { ParkEvent } from '../api/events';

export interface CharacterBirthday {
  name: string;      // 表示名
  date: string;      // 'M/D' 表示用
  note?: string;     // 補足（記念日・初登場日など。公式設定なら省略）
}

interface CharacterGroup {
  keywords: string[];           // event.name に部分一致でこのグループを表示
  characters: CharacterBirthday[];
}

const SESAME: CharacterBirthday[] = [
  { name: 'エルモ', date: '2/3' },
  { name: 'クッキーモンスター', date: '11/2' },
  { name: 'バート', date: '7/26' },
  { name: 'アーニー', date: '1/28' },
  { name: 'ビッグバード', date: '3/20' },
  { name: 'アビー・カダビー', date: '10/21' },
  { name: 'ゾーイ', date: '9/30' },
  { name: 'グローバー', date: '10/14' },
  { name: 'カウント伯爵', date: '10/9' },
  { name: 'モッピー', date: '3/31', note: 'USJ開園日と同日' },
];

const PEANUTS: CharacterBirthday[] = [
  { name: 'スヌーピー', date: '8/10' },
  { name: 'チャーリー・ブラウン', date: '10/30' },
  { name: 'ウッドストック', date: '4/4' },
  { name: 'ペパーミント・パティ', date: '8/22', note: '初登場日' },
  { name: 'ルーシー', date: '3/3', note: '初登場日' },
  { name: 'ライナス', date: '9/19', note: '初登場日' },
  { name: 'サリー', date: '8/23', note: '初登場日' },
];

const SANRIO: CharacterBirthday[] = [
  { name: 'ハローキティ', date: '11/1' },
  { name: 'ダニエル', date: '5/3' },
  { name: 'クロミ', date: '10/31' },
  { name: 'マイメロディ', date: '1/18' },
  { name: 'ミミィ', date: '11/1' },
];

const GROUPS: CharacterGroup[] = [
  {
    keywords: ['ミニオン', 'グルー', 'ベロウィーン', 'ジングル・ベロー'],
    characters: [
      { name: 'ミニオン', date: '3/20', note: '「ミニオンの日」記念日。個々のミニオンに誕生日設定なし' },
      { name: 'グルー', date: '9/28', note: '第1作の書類に記載' },
    ],
  },
  {
    keywords: ['コナン'],
    characters: [
      { name: '江戸川コナン／工藤新一', date: '5/4' },
      { name: '毛利蘭', date: '4/10' },
      { name: '灰原哀', date: '6/1' },
      { name: '怪盗キッド', date: '6/21' },
    ],
  },
  {
    keywords: ['ハリー・ポッター', 'ホグワーツ', 'ホグズミード', 'バタービール', 'ヒッポグリフ', 'バック・トゥ・ホグワーツ'],
    characters: [
      { name: 'ハリー・ポッター', date: '7/31' },
      { name: 'ハーマイオニー', date: '9/19' },
      { name: 'ロン', date: '3/1' },
    ],
  },
  {
    keywords: ['ニンテンドー', 'マリオ', 'パワーアップバンド', 'ドンキーコング'],
    characters: [
      { name: 'マリオ', date: '9/13', note: '1985年スーパーマリオブラザーズ発売日' },
      { name: 'ルイージ', date: '9/13', note: '双子として同日' },
      { name: 'ドンキーコング', date: '7/9', note: '1981年アーケード版稼働日・ファン慣例' },
    ],
  },
  {
    keywords: ['ジュラシック'],
    characters: [
      { name: 'ジュラシック・パーク（映画）', date: '6/11', note: '1993年米国公開日。恐竜に誕生日設定なし' },
    ],
  },
  { keywords: ['セサミ', 'エルモ', 'クッキーモンスター', 'モッピー'], characters: SESAME },
  { keywords: ['スヌーピー', 'ピーナッツ', 'チャーリー・ブラウン'], characters: PEANUTS },
  { keywords: ['ハローキティ', 'キティ', 'サンリオ', 'クロミ', 'マイメロ', 'ダニエル'], characters: SANRIO },
  {
    keywords: ['ウッディー', 'ウッドペッカー', 'ウィニー'],
    characters: [
      { name: 'ウッディー・ウッドペッカー', date: '11/25', note: '1940年スクリーンデビュー日' },
      { name: 'ウィニー・ウッドペッカー', date: '11/25' },
    ],
  },
  // ユニバーサル・ワンダーランドはセサミ・ピーナッツ・サンリオ3作品のキッズエリア
  { keywords: ['ワンダーランド'], characters: [...SESAME, ...PEANUTS, ...SANRIO] },
];

// event.name にキーワードが含まれるグループのキャラを定義順に結合して返す（重複 name は除外）。該当なしは []
export function getCharacterBirthdaysForEvent(event: ParkEvent): CharacterBirthday[] {
  const result: CharacterBirthday[] = [];
  const seen = new Set<string>();
  for (const group of GROUPS) {
    if (!group.keywords.some(k => event.name.includes(k))) continue;
    for (const c of group.characters) {
      if (seen.has(c.name)) continue;
      seen.add(c.name);
      result.push(c);
    }
  }
  return result;
}
