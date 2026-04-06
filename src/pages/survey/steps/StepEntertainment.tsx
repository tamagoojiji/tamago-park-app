import { useMemo } from 'react';
import type { SurveyFormData } from '../../../types/survey';
import type { ShowData } from '../../../api/shows';
import QuestionCard from '../components/QuestionCard';
import { MultiSelect, type MultiSelectOption } from '../components/FormComponents';
import { SHOW_OPTIONS, SEASONAL_SHOW_OPTIONS, GREETING_OPTIONS } from '../../../data/survey-options';

interface EventEntry {
  name: string;
  start: string;
  end: string;
}

interface Props {
  data: SurveyFormData;
  onChange: (patch: Partial<SurveyFormData>) => void;
  shows: ShowData[];
  events: EventEntry[];
  visitDate: string;
}

export default function StepEntertainment({ data, onChange, shows, events, visitDate }: Props) {
  // 来園日に公演があるショー名のセット
  const activeShowNames = useMemo(
    () => new Set(shows.map((s) => s.name)),
    [shows]
  );

  // ショー名の部分一致判定
  const isShowActive = (name: string) => {
    if (shows.length === 0) return true; // データ未取得時はバッジなし
    return activeShowNames.has(name) ||
      shows.some(s => s.name.includes(name) || name.includes(s.name));
  };

  // 常設ショー選択肢にステータスバッジを付与
  const showOptions: MultiSelectOption[] = SHOW_OPTIONS.map((name) => ({
    value: name,
    badge: !isShowActive(name) && shows.length > 0 ? 'この日は公演なし' : undefined,
    badgeType: !isShowActive(name) && shows.length > 0 ? 'closed' as const : undefined,
  }));

  // 季節系ショー固定選択肢にバッジ付与
  const seasonalShowOptions: MultiSelectOption[] = SEASONAL_SHOW_OPTIONS.map((name) => ({
    value: name,
    badge: !isShowActive(name) && shows.length > 0 ? 'この日は公演なし' : undefined,
    badgeType: !isShowActive(name) && shows.length > 0 ? 'closed' as const : undefined,
  }));

  // 来園日に開催中のイベント
  const activeEventOptions: MultiSelectOption[] = useMemo(() => {
    if (!visitDate) return events.map((e) => ({ value: e.name }));
    return events
      .filter((e) => e.start <= visitDate && e.end >= visitDate)
      .map((e) => ({ value: e.name, badge: '開催中', badgeType: 'active' as const }));
  }, [events, visitDate]);

  // Q18: 季節系ショー + 動的イベントを結合
  const seasonalOptions = [...seasonalShowOptions, ...activeEventOptions];

  return (
    <>
      <QuestionCard
        label="Q17. ショーやパレードは見たい？（常設）"
        note={shows.length > 0 ? `来園日に${shows.length}件のショーが公演予定` : undefined}
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
        note={activeEventOptions.length > 0 ? `来園日に${activeEventOptions.length}件のイベントが開催中` : undefined}
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
