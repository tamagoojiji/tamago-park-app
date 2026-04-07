import { useMemo } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import type { ShowData } from '../../../api/shows';
import QuestionCard from '../components/QuestionCard';
import { MultiSelect, type MultiSelectOption } from '../components/FormComponents';
import { SHOW_OPTIONS, SEASONAL_SHOW_OPTIONS, GREETING_OPTIONS } from '../../../data/survey-options';

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  shows: ShowData[];
  showsLoaded: boolean;
}

// 常設ショー名のセット（部分一致判定用）
const PERMANENT_NAMES = new Set<string>(SHOW_OPTIONS);

// API未掲載の常設ショー（バッジ判定を免除）
const API_EXEMPT_SHOWS = new Set(['名探偵コナン４Dライブショー']);

function isPermanent(showName: string): boolean {
  if (PERMANENT_NAMES.has(showName)) return true;
  for (const perm of PERMANENT_NAMES) {
    if (showName.includes(perm) || perm.includes(showName)) return true;
  }
  return false;
}

export default function StepEntertainment({ data, onChange, shows, showsLoaded }: Props) {
  // 常設ショー選択肢にステータスバッジを付与
  const showOptions: MultiSelectOption[] = useMemo(() => {
    if (shows.length === 0) return SHOW_OPTIONS.map((name) => ({ value: name }));

    return SHOW_OPTIONS.map((name) => {
      if (API_EXEMPT_SHOWS.has(name)) return { value: name };
      const isActive = shows.some(s => s.name.includes(name) || name.includes(s.name));
      return {
        value: name,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    });
  }, [shows]);

  // 季節系: 定数リストをベースに、shows APIデータがあれば公演有無バッジ付与
  const seasonalOptions: MultiSelectOption[] = useMemo(() => {
    // APIにしかない季節ショー（定数リストにないもの）も追加
    const apiOnlyShows = shows
      .filter((s) => !isPermanent(s.name) && !SEASONAL_SHOW_OPTIONS.some(opt => s.name.includes(opt) || opt.includes(s.name)))
      .map((s) => s.name);

    const allNames = [...SEASONAL_SHOW_OPTIONS, ...apiOnlyShows];

    return allNames.map((name) => {
      if (!showsLoaded || shows.length === 0) return { value: name };
      const isActive = shows.some(s => s.name.includes(name) || name.includes(s.name));
      return {
        value: name,
        badge: isActive ? undefined : 'この日は公演なし',
        badgeType: isActive ? undefined : 'closed' as const,
      };
    });
  }, [shows, showsLoaded]);

  const permanentActiveCount = useMemo(
    () => shows.filter((s) => isPermanent(s.name)).length,
    [shows]
  );

  return (
    <>
      <QuestionCard
        label="Q17. ショーやパレードは見たい？（常設）"
        note={shows.length > 0 ? `来園日に${permanentActiveCount}件の常設ショーが公演予定` : undefined}
      >
        <MultiSelect
          name="shows"
          options={showOptions}
          values={data.shows}
          onChange={(v) => onChange({ shows: v })}
        />
      </QuestionCard>

      <QuestionCard
        label="Q18. ショーやパレードは見たい？（季節・期間限定）"
      >
        <MultiSelect
          name="seasonal_events"
          options={seasonalOptions}
          values={data.seasonal_events}
          onChange={(v) => onChange({ seasonal_events: v })}
        />
      </QuestionCard>

      <QuestionCard label="Q19. グリーティングは参加したい？">
        <MultiSelect
          name="greetings"
          options={GREETING_OPTIONS.map((o) => ({ value: o }))}
          values={data.greetings}
          onChange={(v) => onChange({ greetings: v })}
        />
      </QuestionCard>
    </>
  );
}
